// sectionController.js
const Section = require('../models/Section');
const Project = require('../models/Project');
const authenticateToken = require('../middleware/authMiddleware');

const sectionController = {
  async create(req, res) {
    try {
      const { name } = req.body;
      const projectId = req.params.projectId;
      
      // Verifica se o projeto existe
      const project = await Project.findById(req.user.id, projectId);
      if (!project) {
        return res.status(404).json({ message: 'Projeto não encontrado.' });
      }
  
      const newSection = await Section.create(req.user.id, projectId, { name });
      res.status(201).json(newSection);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar seção.' });
    }
  },

  // Atualiza o nome de uma seção
  async updateSection(req, res) {
    try {
      const { projectId, sectionId } = req.params;
      const userId = req.user.id;
  
      // Criar um objeto com os campos a serem atualizados
      const updatedData = {};
      if (req.body.name) {
        updatedData.name = req.body.name; 
      }
      if (req.body.color) {
        updatedData.color = req.body.color;
      }
  
      // Verifique se há dados para atualizar
      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'Nenhum dado para atualizar.' });
      }
  
      await Section.update(userId, projectId, sectionId, updatedData);
      res.status(200).json({ message: 'Seção atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar a seção:', error);
      res.status(500).json({ message: 'Erro ao atualizar a seção.' });
    }
  },

  async getSections(req, res) {
    try {
      const projectId = req.params.projectId; 
      const userId = req.user.id; // Obter o userId
      const sections = await Section.getByProject(userId, projectId); // Passa o userId e projectId
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao recuperar seções.' });
    }
  },

  async deleteSection(req, res) {
    try {
      const { projectId, sectionId } = req.params; 
      const userId = req.user.id; // Obter o userId do token
      await Section.delete(userId, projectId, sectionId); // Passa o userId
      res.status(204).send(); 
    } catch (error) {
      console.error('Erro ao excluir seção:', error); // Logar o erro no servidor
      res.status(500).json({ message: 'Erro ao excluir seção.' });
    }
  },
};

module.exports = sectionController;