// Template System - CRUD operations for email templates

const fs = require('fs');
const path = require('path');

const TEMPLATES_FILE = path.join(__dirname, 'templates.json');

// Initialize templates file if not exists
function initStorage() {
  if (!fs.existsSync(TEMPLATES_FILE)) {
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify([], null, 2));
  }
}

// Read all templates from storage
function readTemplates() {
  initStorage();
  const data = fs.readFileSync(TEMPLATES_FILE, 'utf8');
  return JSON.parse(data);
}

// Write templates to storage
function writeTemplates(templates) {
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(templates, null, 2));
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new template
 * @param {Object} data - Template data { name, subject, body }
 * @returns {Object} Created template with id
 */
function createTemplate(data) {
  if (!data || !data.name || !data.subject || !data.body) {
    throw new Error('Template must have name, subject, and body');
  }

  const templates = readTemplates();
  const newTemplate = {
    id: generateId(),
    name: data.name,
    subject: data.subject,
    body: data.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  templates.push(newTemplate);
  writeTemplates(templates);

  return newTemplate;
}

/**
 * Get all templates
 * @returns {Array} List of all templates
 */
function getTemplates() {
  return readTemplates();
}

/**
 * Get a single template by ID
 * @param {string} id - Template ID
 * @returns {Object|null} Template object or null if not found
 */
function getTemplate(id) {
  const templates = readTemplates();
  return templates.find(t => t.id === id) || null;
}

/**
 * Update a template by ID
 * @param {string} id - Template ID
 * @param {Object} data - Updated data { name, subject, body }
 * @returns {Object|null} Updated template or null if not found
 */
function updateTemplate(id, data) {
  const templates = readTemplates();
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) {
    return null;
  }

  const updatedTemplate = {
    ...templates[index],
    ...data,
    id: templates[index].id, // Preserve original ID
    updatedAt: new Date().toISOString()
  };

  templates[index] = updatedTemplate;
  writeTemplates(templates);

  return updatedTemplate;
}

/**
 * Delete a template by ID
 * @param {string} id - Template ID
 * @returns {boolean} True if deleted, false if not found
 */
function deleteTemplate(id) {
  const templates = readTemplates();
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) {
    return false;
  }

  templates.splice(index, 1);
  writeTemplates(templates);

  return true;
}

module.exports = {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate
};
