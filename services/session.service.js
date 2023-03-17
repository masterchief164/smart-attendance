const Session = require('../models/session.model');


const addSession = async (user, course) => {
    try {
        const sessionDetails = {
            courseId: user._id, // TODO replace with course._id
            instructor: user._id,
            date: new Date(),
        }
        return await Session.create(sessionDetails);

    } catch (error) {
        console.log(error);
    }
}

const addAttendance = async (user, sessionId) => {
    const session = await Session.findOne({_id: sessionId});
    try {
        if (session) {
            const attendees = new Set(session.attendees);
            attendees.add(user._id);
            session.attendees = [...attendees];
            await session.save();
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }

}

const getSessions = async (courseID, userID) => {
    try {
        const sessions = await Session.find({courseId: courseID});
        let attendanceCount = 0;
        sessions.forEach(session =>{
            if (session.attendees?.length > 0)
                attendanceCount += session.attendees.includes(userID)? 1: 0;
        })
        return {
            sessionsCount: sessions.length,
            sessionDates: sessions.map(session => session.date),
            attendanceCount: attendanceCount,
        };
    } catch (error) {
        console.log(error);
    }
}

const getSession = async (sessionId) => {
    try {
        return await Session.findOne({_id: sessionId});
    } catch (error) {
        console.log(error);
    }
}

const deleteSession = async (sessionId) => {
    try {
        return await Session.findOneAndRemove({_id: sessionId});
    } catch (error) {
        console.log(error);
    }
}

module.exports = {addSession, getSessions, getSession, addAttendance, deleteSession}
