-- Add COACH and TUTOR to the Role enum
-- PostgreSQL requires adding new enum values with ALTER TYPE
ALTER TYPE "Role" ADD VALUE 'COACH';
ALTER TYPE "Role" ADD VALUE 'TUTOR';
