const Session = require('../models/session.model');
const courseService = require('./course.service');
const Attending = require('../models/attending.model');


const addSession = async (user, courseID) => {
    try {
        const course = await courseService.getCourse(courseID)
        if (!course) {
            return null;
        }
        const sessionDetails = {
            courseId: course._id,
            instructor: user._id,
            date: new Date(),
        }
        const session = await Session.create(sessionDetails);
        course.sessions.push(session._id);
        await course.save();
        return session;

    } catch (error) {
        console.log(error);
    }
}

const addAttendance = async (user, sessionId) => {
    const session = await Session.findOne({_id: sessionId});
    const course = await courseService.getCourse(session.courseId);
    if (!course.students.includes(user._id)) {
        await courseService.addStudent(course._id, user._id)
    }
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
        const sessions = await Session.find({courseId: courseID}).lean();
        let attendanceCount = 0;
        sessions.forEach((session, index) => {
            if (session.attendees?.length > 0) {
                for (let attendee of session.attendees) {
                    if (attendee.toString() === userID) {
                        attendanceCount++;
                        sessions[index].attended = true;
                    }
                }
            } else {
                sessions[index].attended = false;
            }
        })
        sessions.sort((a, b) => new Date(a.date) - new Date(b.date));
        return {
            sessionsCount: sessions.length,
            sessionDates: sessions.map(session => session.date),
            attendanceCount: attendanceCount,
            sessionIds: sessions.map(session => session._id),
            sessions
        };
    } catch (error) {
        console.log(error);
    }
}

const getSession = async (sessionId) => {
    try {
        return await Session.findOne({_id: sessionId}).populate('attendees').populate('instructor').populate('courseId');
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

const addTempSession = async (user, sessionId) => {
    try {
        const session = await Session.findOne({_id: sessionId});
        const course = await courseService.getCourse(session.courseId);
        if (!course.students.includes(user._id)) {
            await courseService.addStudent(course._id, user._id)
        }
        return await Attending.create({
            courseId: course._id,
            instructor: course.instructor._id,
            attendee: user._id,
            time: new Date().getTime(),
            sessionId: session._id
        });
    } catch (error) {
        console.log(error);
    }
}

const getTempSession = async (id) => {
    try {
        console.log(id.slice(1,-1))
        return await Attending.findById(id.slice(1,-1))
    } catch (error) {
        console.log(error);
    }
}

const deleteTempSession = async (id) => {
    try {
        return await Attending.findByIdAndDelete(id);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addSession,
    getSessions,
    getSession,
    addAttendance,
    deleteSession,
    addTempSession,
    getTempSession,
    deleteTempSession
}
