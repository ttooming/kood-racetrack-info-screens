jest.useFakeTimers();

const { startTimer } = require("../utils/timer");

test("timer should count down to 0", () => {
    const io = { emit: jest.fn() };

    startTimer(io, 3, jest.fn());

    jest.advanceTimersByTime(3000);

    jest.runOnlyPendingTimers();

    expect(io.emit).toHaveBeenCalledWith("timerUpdate", 0);
});