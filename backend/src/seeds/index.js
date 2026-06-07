/**
 * CampusRide - Database Seed Script
 * Creates initial admin user and sample approved students
 * Run: npm run seed
 */

require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const ApprovedStudent = require('../models/ApprovedStudent');
const logger = require('../utils/logger');

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Seeding database...');

    // ─── Create Super Admin ─────────────────────────────
    const existingAdmin = await User.findOne({ email: 'admin@campusride.com' });
    if (!existingAdmin) {
      const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@campusride.com',
        phone: '9999999999',
        password: 'admin123',
        role: 'super_admin',
        status: 'active',
        isEmailVerified: true,
      });

      await Admin.create({
        user: adminUser._id,
        employeeId: 'ADM001',
        department: 'Transport',
        designation: 'Transport Head',
        isSuperAdmin: true,
        permissions: {
          manageStudents: true,
          manageBuses: true,
          manageRoutes: true,
          manageDrivers: true,
          managePayments: true,
          viewReports: true,
          viewAuditLogs: true,
          manageSettings: true,
        },
      });

      logger.info('✅ Super Admin created: admin@campusride.com / admin123');
    } else {
      logger.info('Super Admin already exists, skipping...');
    }

    // ─── Seed Approved Students ─────────────────────────
    const sampleStudents = [
      { prn: 'PRN2024001', name: 'Rahul Sharma', email: 'rahul@college.edu', department: 'Computer Science', year: 2 },
      { prn: 'PRN2024002', name: 'Priya Patel', email: 'priya@college.edu', department: 'Computer Science', year: 2 },
      { prn: 'PRN2024003', name: 'Amit Kumar', email: 'amit@college.edu', department: 'Electronics', year: 3 },
      { prn: 'PRN2024004', name: 'Sneha Desai', email: 'sneha@college.edu', department: 'Mechanical', year: 1 },
      { prn: 'PRN2024005', name: 'Vikram Singh', email: 'vikram@college.edu', department: 'Civil', year: 4 },
      { prn: 'PRN2024006', name: 'Anita Joshi', email: 'anita@college.edu', department: 'IT', year: 2 },
      { prn: 'PRN2024007', name: 'Karan Mehta', email: 'karan@college.edu', department: 'Computer Science', year: 1 },
      { prn: 'PRN2024008', name: 'Divya Rao', email: 'divya@college.edu', department: 'Electronics', year: 3 },
      { prn: 'PRN2024009', name: 'Suresh Patil', email: 'suresh@college.edu', department: 'Mechanical', year: 2 },
      { prn: 'PRN2024010', name: 'Meera Nair', email: 'meera@college.edu', department: 'IT', year: 4 },
    ];

    let added = 0;
    for (const student of sampleStudents) {
      try {
        await ApprovedStudent.create({ ...student, academicYear: '2024-2025' });
        added++;
      } catch (error) {
        if (error.code !== 11000) {
          logger.error(`Failed to add ${student.prn}:`, error.message);
        }
      }
    }
    logger.info(`✅ ${added} sample approved students added`);

    logger.info('🎉 Database seeding complete!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
