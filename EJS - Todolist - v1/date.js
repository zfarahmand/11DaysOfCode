exports.getDate = () => {
    const today = new Date();

    const options = { weekday: 'long' , day: 'numeric' , month: 'long' , year: 'numeric' };
    return {
        dayName: today.toLocaleDateString('fa-IR' , {weekday: options.weekday}),
        day: today.toLocaleDateString('fa-IR' , {day: options.day}),
        month: today.toLocaleDateString('fa-IR' , {month: options.month}),
    };
};

exports.getDay = () => {
    const today = new Date();

    const options = { weekday: 'long'};
    return today.toLocaleDateString('fa-IR' , options)
};

// module.exports = getDate;


