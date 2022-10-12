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

module.exports = {addSession, addAttendance}
