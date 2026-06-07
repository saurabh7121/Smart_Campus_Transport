/**
 * CampusRide - User Roles
 * Defines all user roles and their hierarchy
 */

const ROLES = Object.freeze({
  STUDENT: 'student',
  PARENT: 'parent',
  DRIVER: 'driver',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
});

const ROLE_HIERARCHY = Object.freeze({
  [ROLES.SUPER_ADMIN]: 5,
  [ROLES.ADMIN]: 4,
  [ROLES.DRIVER]: 3,
  [ROLES.PARENT]: 2,
  [ROLES.STUDENT]: 1,
});

const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ROLE_HIERARCHY, ALL_ROLES };
