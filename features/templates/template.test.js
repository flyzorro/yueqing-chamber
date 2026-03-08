const {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
} = require('./template');

const fs = require('fs');
const path = require('path');

const TEMPLATES_FILE = path.join(__dirname, 'templates.json');

// Clean up before each test
function cleanup() {
  if (fs.existsSync(TEMPLATES_FILE)) {
    fs.unlinkSync(TEMPLATES_FILE);
  }
}

// Test data
const sampleTemplate = {
  name: 'Welcome Email',
  subject: 'Welcome to our service!',
  body: 'Hi {{name}}, welcome aboard!'
};

const followUpTemplate = {
  name: 'Follow-up Email',
  subject: 'Checking in',
  body: 'Hi {{name}}, just checking in...'
};

// Run tests
function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      cleanup();
      fn();
      console.log(`✓ ${name}`);
      passed++;
    } catch (err) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${err.message}`);
      failed++;
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  // Test: createTemplate
  test('createTemplate should create a template with ID', () => {
    const template = createTemplate(sampleTemplate);
    assert(template.id, 'Template should have an ID');
    assert(template.name === sampleTemplate.name, 'Name should match');
    assert(template.subject === sampleTemplate.subject, 'Subject should match');
    assert(template.body === sampleTemplate.body, 'Body should match');
    assert(template.createdAt, 'Should have createdAt');
    assert(template.updatedAt, 'Should have updatedAt');
  });

  test('createTemplate should throw error for invalid data', () => {
    try {
      createTemplate({});
      throw new Error('Should have thrown error');
    } catch (err) {
      assert(err.message.includes('name, subject, and body'), 'Should require name, subject, body');
    }
  });

  // Test: getTemplates
  test('getTemplates should return empty array initially', () => {
    const templates = getTemplates();
    assert(Array.isArray(templates), 'Should return array');
    assert(templates.length === 0, 'Should be empty');
  });

  test('getTemplates should return all templates', () => {
    createTemplate(sampleTemplate);
    createTemplate(followUpTemplate);
    const templates = getTemplates();
    assert(templates.length === 2, 'Should have 2 templates');
  });

  // Test: getTemplate
  test('getTemplate should return template by ID', () => {
    const created = createTemplate(sampleTemplate);
    const found = getTemplate(created.id);
    assert(found !== null, 'Should find template');
    assert(found.id === created.id, 'ID should match');
  });

  test('getTemplate should return null for non-existent ID', () => {
    const found = getTemplate('non-existent-id');
    assert(found === null, 'Should return null');
  });

  // Test: updateTemplate
  test('updateTemplate should update existing template', () => {
    const created = createTemplate(sampleTemplate);
    const originalUpdatedAt = created.updatedAt;
    // Small delay to ensure timestamp difference
    const updated = updateTemplate(created.id, { subject: 'Updated Subject' });
    assert(updated !== null, 'Should return updated template');
    assert(updated.subject === 'Updated Subject', 'Subject should be updated');
    assert(updated.name === sampleTemplate.name, 'Name should remain unchanged');
    assert(updated.updatedAt !== originalUpdatedAt, 'updatedAt should be different');
  });

  test('updateTemplate should return null for non-existent ID', () => {
    const updated = updateTemplate('non-existent-id', { subject: 'Test' });
    assert(updated === null, 'Should return null');
  });

  // Test: deleteTemplate
  test('deleteTemplate should remove template', () => {
    const created = createTemplate(sampleTemplate);
    const deleted = deleteTemplate(created.id);
    assert(deleted === true, 'Should return true');
    const found = getTemplate(created.id);
    assert(found === null, 'Template should be deleted');
  });

  test('deleteTemplate should return false for non-existent ID', () => {
    const deleted = deleteTemplate('non-existent-id');
    assert(deleted === false, 'Should return false');
  });

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
