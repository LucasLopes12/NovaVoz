export function getTodayDate() {
    return new Date().toDateString();
};

export function isYesterday(lastDate) {
    const today = new Date();
    const yesterday = new Date();

    yesterday.setDate(today.getDate() - 1);

    return (
        new Date(lastDate).toDateString() === yesterday.toDateString()
    );
};