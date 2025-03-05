// pocRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('./authMiddleware');
const {
    getClients,
    verifyPOCEmail,
    verifyEmail,
    createUser,
    getDepartments,
    getPocsByDepartment,
    getAppointmentDetailsForPoc,
    getAvailableDates,
    getAvailableTimes,
    createAppointment,
    updateFullAvailability,
    updatePartialAvailability,
    getAvailableTimesForUpdate,
    getAvailableDatesForUpdate,
    updatePassword,
    matchLoginCredentials,
    requestPasswordReset,
    resetPassword,
    getClientFromPOC,
    pocAppointmentCount,
    pocTypeAppointments,
    pocTodayAppointments,
    addPOC,
    fetchPOC,
    fetchAppointmentDetails,
    getDoctorsForClient,
    adminAppointmentCount,
    fetchDepartmentDoctorCount,
    appointmentDetails,
    adminAppointmentDetails,
    adminDepartments,
    updateSchedule,
    getSchedule,
    getMeetLink,
    UpdateMeetLink,
    getConsultationFees,
    updateConsultationFees,
    getUserDetails,
    updateAppointmentStatus,
    adminTodayAppointments
} = require('../controllers/pocController');

//router.post('/clients', getClients);
//router.post('/poc-login', authMiddleware, matchLoginCredentials);

// Protected routes
router.post('/users', authMiddleware, createUser);
router.post('/departments', authMiddleware, getDepartments);
router.post('/pocs', authMiddleware, getPocsByDepartment);
router.post('/appointments', authMiddleware, getAppointmentDetailsForPoc);
router.post('/pocs/available-dates', authMiddleware, getAvailableDates);
router.post('/pocs/available-times', authMiddleware, getAvailableTimes);
router.post('/create-appointments', authMiddleware, createAppointment);
router.post('/pocs/available-times-update', authMiddleware, getAvailableTimesForUpdate);
router.post('/pocs/available-dates-update', authMiddleware, getAvailableDatesForUpdate);
router.post('/pocs/update-full', authMiddleware, updateFullAvailability);
router.post('/pocs/update-partial', authMiddleware, updatePartialAvailability);
router.post('/verify-poc-email', authMiddleware, verifyPOCEmail);
router.post('/verify-email', authMiddleware, verifyEmail);
router.post('/update-password', authMiddleware, updatePassword);
router.post('/request-password-reset', authMiddleware, requestPasswordReset);
router.post('/reset-password', authMiddleware, resetPassword);
router.post('/getClientId', authMiddleware, getClientFromPOC);
router.post('/poc/appointment-count', authMiddleware, pocAppointmentCount);
router.post('/poc/typeAppointment', authMiddleware, pocTypeAppointments);
router.post('/poc/todays-appointments', authMiddleware, pocTodayAppointments);
router.post('/poc/update-appointment-status', authMiddleware, updateAppointmentStatus);
router.post('/add-poc', authMiddleware, addPOC);
router.get('/doctor/:pocId', authMiddleware, fetchPOC);
router.get('/poc/appointments/:pocId', authMiddleware, fetchAppointmentDetails);
router.post('/poc/get-doctors', authMiddleware, getDoctorsForClient);
router.post('/admin/appointment-count', authMiddleware, adminAppointmentCount);
router.post('/admin/total-departments-doctors', authMiddleware, fetchDepartmentDoctorCount);
router.post('/poc/appointment-details', authMiddleware, appointmentDetails);
router.post('/admin/appointment-details', authMiddleware, adminAppointmentDetails);
router.post('/admin/departments', authMiddleware, adminDepartments);
router.get('/poc/schedule/:pocId', authMiddleware, getSchedule);
router.post('/update-schedule', authMiddleware, updateSchedule);
router.post('/poc/get-link', authMiddleware, getMeetLink);
router.post('/poc/update-link', authMiddleware, UpdateMeetLink);
router.post('/poc/get-consultation-fees', authMiddleware, getConsultationFees);
router.post('/poc/update-consultation-fees', authMiddleware, updateConsultationFees);
router.post('/getUsers', authMiddleware, getUserDetails);
router.post('/admin/todays-appointments', authMiddleware, adminTodayAppointments);
router.post('/admin/update-appointment-status', authMiddleware, updateAppointmentStatus);

module.exports = router;