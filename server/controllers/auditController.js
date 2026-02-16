import asyncHandler from "express-async-handler";
import AuditLog from "../models/AuditLog.js";

// @desc    Obtener todos los logs de auditoría
// @route   GET /api/audit
// @access  Private/Admin
export const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find({})
    .populate("adminId", "email") 
    .select("-__v -updatedAt")   
    .sort({ createdAt: -1 })
    .limit(15);                   

  res.json(logs);
});
