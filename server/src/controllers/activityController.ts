import { Request, Response } from 'express';
import { activityModel } from '../models/Activity';

// 获取活动列表
export const getActivities = (req: Request, res: Response): void => {
  try {
    const activities = activityModel.findAll();
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取活动列表失败'
    });
  }
};

// 获取单个活动
export const getActivity = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const activity = activityModel.findById(id);
    
    if (!activity) {
      res.status(404).json({
        success: false,
        message: '活动不存在'
      });
      return;
    }
    
    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取活动失败'
    });
  }
};

// 创建活动
export const createActivity = (req: Request, res: Response): void => {
  try {
    const { title, description, date, location, maxParticipants, status } = req.body;
    
    if (!title || !date || !location) {
      res.status(400).json({
        success: false,
        message: '缺少必要字段'
      });
      return;
    }
    
    const activity = activityModel.create({
      title,
      description: description || '',
      date: new Date(date),
      location,
      maxParticipants: maxParticipants || 100,
      currentParticipants: 0,
      status: status || 'upcoming'
    });
    
    res.status(201).json({
      success: true,
      data: activity,
      message: '活动创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '创建活动失败'
    });
  }
};

// 更新活动
export const updateActivity = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const updatedActivity = activityModel.update(id, updateData);
    
    if (!updatedActivity) {
      res.status(404).json({
        success: false,
        message: '活动不存在'
      });
      return;
    }
    
    res.json({
      success: true,
      data: updatedActivity,
      message: '活动更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新活动失败'
    });
  }
};

// 删除活动
export const deleteActivity = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const deleted = activityModel.delete(id);
    
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: '活动不存在'
      });
      return;
    }
    
    res.json({
      success: true,
      message: '活动删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除活动失败'
    });
  }
};

// 报名活动
export const registerActivity = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const success = activityModel.register(id);
    
    if (!success) {
      res.status(400).json({
        success: false,
        message: '报名失败，活动不存在或已满员'
      });
      return;
    }
    
    const activity = activityModel.findById(id);
    res.json({
      success: true,
      data: activity,
      message: '报名成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '报名失败'
    });
  }
};