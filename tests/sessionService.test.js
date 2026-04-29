const { addDriver } = require("../services/sessionService");

describe("addDriver", () => {
    let io;
    let raceState;

    beforeEach(() => {
        // Mock io.emit
        io = {
            emit: jest.fn()
        };

        // Mock state
        raceState = require("../state/raceState");

        raceState.sessions = [
            {
                id: 1,
                drivers: [],
                cars: {}
            }
        ];
    });

    test("should add driver successfully", () => {
        addDriver(io, 1, "Mati", 7);

        expect(raceState.sessions[0].drivers.length).toBe(1);
        expect(io.emit).toHaveBeenCalledWith(
            "addedDriver",
            expect.objectContaining({ success: true }),
            expect.anything()
        );
    });

    test("should not allow duplicate name", () => {
        addDriver(io, 1, "Mati", 7);
        addDriver(io, 1, "Mati", 8);

        expect(io.emit).toHaveBeenCalledWith(
            "addedDriver",
            expect.objectContaining({ success: false }),
            expect.anything()
        );
    });
});