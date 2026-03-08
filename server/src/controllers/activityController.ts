import { Request, Response } from 'express';
import { activityModel } from '../models/Activity';

// 获取活动列表（支持分页）
export const getActivities = (req: Request, res: Response): void => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const allActivities = activityModel.findAll();
    const total = allActivities.length;
    const startIndex = (page - 1) * limit;
    const data = allActivities.slice(startIndex, startIndex + limit);

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取活动列表失败'
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
        error: '活动不存在'
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
      error: '获取活动信息失败'
    });
  }
};

// 创建活动
export const createActivity = (req: Request, res: Response): void => {
  try {
    const { title, description, date, location, maxParticipants } = req.body;

    const activity = activityModel.create({
      title,
      description,
      date: new Date(date),
      location,
      maxParticipants: maxParticipants || 100,
      currentParticipants: 0,
      status: 'upcoming'
    });

    res.status(201).json({
      success: true,
      data: activity,
      message: '活动创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建活动失败'
    });
  }
};

// 更新活动
export const updateActivity = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const activity = activityModel.update(id, updateData);

    if (!activity) {
      res.status(404).json({
        success: false,
        error: '活动不存在'
      });
      return;
    }

    res.json({
      success: true,
      data: activity,
      message: '活动更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新活动失败'
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
        error: '活动不存在'
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
      error: '删除活动失败'
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
        error: '报名失败：活动不存在或已满员'
      });
      return;
    }

    res.json({
      success: true,
      message: '报名成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '报名失败'
    });
  }
};