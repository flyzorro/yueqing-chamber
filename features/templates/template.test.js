const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEMPLATES_FILE = path.join(__dirname, 'templates.json');

// Clean up
function cleanup() {
  if (fs.existsSync(TEMPLATES_FILE)) {
    fs.unlinkSync(TEMPLATES_FILE);
  }
}

// Run a test in isolated process
function runIsolatedTest(name, testCode) {
  try {
    cleanup();
    const fullCode = `
      const { createTemplate, getTemplates, getTemplate, updateTemplate, deleteTemplate } = require('${__dirname}/template');
      ${testCode}
    `;
    execSync(`node -e "${fullCode.replace(/"/g, '\\"')}"`, { stdio: 'pipe' });
    console.log(`✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`✗ ${name}`);
    console.log(`  Error: ${err.message}`);
    return false;
  }
}

// Run all tests
function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: createTemplate should create a template with ID
  if (runIsolatedTest('createTemplate should create a template with ID', `
    const template = createTemplate({
      name: 'Welcome Email',
      subject: 'Welcome to our service!',
      body: 'Hi {{name}}, welcome aboard!'
    });
    if (!template.id) throw new Error('Template should have an ID');
    if (template.name !== 'Welcome Email') throw new Error('Name should match');
    if (template.subject !== 'Welcome to our service!') throw new Error('Subject should match');
    if (template.body !== 'Hi {{name}}, welcome aboard!') throw new Error('Body should match');
    if (!template.createdAt) throw new Error('Should have createdAt');
    if (!template.updatedAt) throw new Error('Should have updatedAt');
  `)) passed++; else failed++;

  // Test 2: createTemplate should throw error for invalid data
  if (runIsolatedTest('createTemplate should throw error for invalid data', `
    try {
      createTemplate({});
      throw new Error('Should have thrown error');
    } catch (err) {
      if (!err.message.includes('name, subject, and body')) throw new Error('Should require name, subject, body');
    }
  `)) passed++; else failed++;

  // Test 3: getTemplates should return empty array initially
  if (runIsolatedTest('getTemplates should return empty array initially', `
    const templates = getTemplates();
    if (!Array.isArray(templates)) throw new Error('Should return array');
    if (templates.length !== 0) throw new Error('Should be empty');
  `)) passed++; else failed++;

  // Test 4: getTemplates should return all templates
  if (runIsolatedTest('getTemplates should return all templates', `
    createTemplate({ name: 'Welcome Email', subject: 'Welcome!', body: 'Hi!' });
    createTemplate({ name: 'Follow-up Email', subject: 'Checking in', body: 'Hello!' });
    const templates = getTemplates();
    if (templates.length !== 2) throw new Error('Should have 2 templates');
  `)) passed++; else failed++;

  // Test 5: getTemplate should return template by ID
  if (runIsolatedTest('getTemplate should return template by ID', `
    const created = createTemplate({ name: 'Welcome Email', subject: 'Welcome!', body: 'Hi!' });
    const found = getTemplate(created.id);
    if (found === null) throw new Error('Should find template');
    if (found.id !== created.id) throw new Error('ID should match');
  `)) passed++; else failed++;

  // Test 6: getTemplate should return null for non-existent ID
  if (runIsolatedTest('getTemplate should return null for non-existent ID', `
    const found = getTemplate('non-existent-id');
    if (found !== null) throw new Error('Should return null');
  `)) passed++; else failed++;

  // Test 7: updateTemplate should update existing template
  if (runIsolatedTest('updateTemplate should update existing template', `
    const created = createTemplate({ name: 'Welcome Email', subject: 'Welcome!', body: 'Hi!' });
    // Small delay to ensure timestamp difference
    const start = Date.now();
    while (Date.now() - start < 10) {}
    const updated = updateTemplate(created.id, { subject: 'Updated Subject' });
    if (updated === null) throw new Error('Should return updated template');
    if (updated.subject !== 'Updated Subject') throw new Error('Subject should be updated');
    if (updated.name !== 'Welcome Email') throw new Error('Name should remain unchanged');
    if (!updated.updatedAt) throw new Error('Should have updatedAt');
  `)) passed++; else failed++;

  // Test 8: updateTemplate should return null for non-existent ID
  if (runIsolatedTest('updateTemplate should return null for non-existent ID', `
    const updated = updateTemplate('non-existent-id', { subject: 'Test' });
    if (updated !== null) throw new Error('Should return null');
  `)) passed++; else failed++;

  // Test 9: deleteTemplate should remove template
  if (runIsolatedTest('deleteTemplate should remove template', `
    const created = createTemplate({ name: 'Welcome Email', subject: 'Welcome!', body: 'Hi!' });
    const deleted = deleteTemplate(created.id);
    if (deleted !== true) throw new Error('Should return true');
    const found = getTemplate(created.id);
    if (found !== null) throw new Error('Template should be deleted');
  `)) passed++; else failed++;

  // Test 10: deleteTemplate should return false for non-existent ID
  if (runIsolatedTest('deleteTemplate should return false for non-existent ID', `
    const deleted = deleteTemplate('non-existent-id');
    if (deleted !== false) throw new Error('Should return false');
  `)) passed++; else failed++;

  // Summary
  console.log(`\n${'='.repeat(40)}`);
  console.log(`Tests: ${passed} passed, ${failed} failed`);
  console.log(`${'='.repeat(40)}`);

  cleanup();

  return failed === 0;
}

// Run tests if executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };
