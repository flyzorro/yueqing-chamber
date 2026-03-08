// Template module - CRUD operations

const templates = new Map();
let idCounter = 1;

// Create
function createTemplate(data) {
  const id = idCounter++;
  const template = { id, ...data, createdAt: new Date().toISOString() };
  templates.set(id, template);
  return template;
}

// Read
function getTemplate(id) {
  return templates.get(id);
}

function getAllTemplates() {
  return Array.from(templates.values());
}

// Update
function updateTemplate(id, data) {
  const existing = templates.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
  templates.set(id, updated);
  return updated;
}

// Delete
function deleteTemplate(id) {
  return templates.delete(id);
}

module.exports = {
  createTemplate,
  getTemplate,
  getAllTemplates,
  updateTemplate,
  deleteTemplate
};