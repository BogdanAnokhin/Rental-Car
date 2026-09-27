const { price } = require("./rentalPrice");

test("calculates normal low-season price", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Compact",
      30,
      10
    )
  ).toBe("$30.00");
});

test("rejects driver under 18", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Compact",
      17,
      10
    )
  ).toBe("Driver too young - cannot quote the price");
});

test("drivers aged 18-21 can only rent Compact cars", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Electric",
      20,
      10
    )
  ).toBe(
    "Drivers 21 y/o or less can only rent Compact vehicles"
  );
});

test("rejects drivers with license for less than one year", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Compact",
      30,
      0.5
    )
  ).toBe(
    "Individuals holding a driver's license for less than a year are ineligible to rent"
  );
});

test("adds 30 percent for license held less than two years", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Compact",
      30,
      1.5
    )
  ).toBe("$39.00");
});

test("adds 15 euros per day in high season for license under three years", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-01",
      "Compact",
      30,
      2.5
    )
  ).toBe("$51.75");
});

test("does not add license surcharge when license is three years old", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-01",
      "Compact",
      30,
      3
    )
  ).toBe("$34.50");
});

test("adds 15 percent in high season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-01",
      "Compact",
      30,
      10
    )
  ).toBe("$34.50");
});

test("adds 50 percent for Racer age 25 in high season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-01",
      "Racer",
      25,
      10
    )
  ).toBe("$43.12");
});

test("does not add Racer surcharge when driver is over 25", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-01",
      "Racer",
      26,
      10
    )
  ).toBe("$29.90");
});

test("does not add Racer surcharge in low season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-12",
      "Racer",
      25,
      10
    )
  ).toBe("$25.00");
});

test("adds 5 percent to weekend days", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-15",
      "2024-02-17",
      "Compact",
      50,
      10
    )
  ).toBe("$152.50");
});

test("adds weekend price to Sunday", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-18",
      "2024-02-18",
      "Compact",
      30,
      10
    )
  ).toBe("$31.50");
});

test("applies ten percent discount to long low-season rentals", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-02-12",
      "2024-02-22",
      "Compact",
      30,
      10
    )
  ).toBe("$299.70");
});

test("does not apply long-rental discount in high season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-04-01",
      "2024-04-11",
      "Compact",
      30,
      10
    )
  ).toBe("$382.95");
});

test("adds one-way rental fee", () => {
  expect(
    price(
      "Tallinn",
      "Tartu",
      "2024-02-12",
      "2024-02-12",
      "Compact",
      30,
      10
    )
  ).toBe("$55.00");
});

test("detects high season when rental starts in low season and ends in high season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-03-31",
      "2024-04-01",
      "Compact",
      30,
      10
    )
  ).toBe("$70.72");
});

test("November is low season", () => {
  expect(
    price(
      "Tallinn",
      "Tallinn",
      "2024-11-01",
      "2024-11-01",
      "Compact",
      30,
      10
    )
  ).toBe("$30.00");
});
