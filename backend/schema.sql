CREATE TABLE flight (
    char flightID PRIMARY KEY,
    char originAirportID,
    char destinationAirportID,
    char airplane,
    int bookedEconomy,
    int bookedBusiness,
    int bookedFirst,
)

CREATE TABLE airplane (
    char airplaneModel,
    int seatsEconomy,
    int seatsBusiness,
    int seatsFirst,
);

CREATE TABLE airport (
    char airportCode,
    char[] supportedAirplanes,
    char country,
    char city,
)

CREATE TABLE booking (
    char userID,
    char flightID,
    char seatNo,
    char promoDiscount,
    int amountDue,
    bool paid,

)