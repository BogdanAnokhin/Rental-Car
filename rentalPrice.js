const HIGH_SEASON = "High";
const LOW_SEASON = "Low";

const HIGH_SEASON_START_MONTH = 3;
const HIGH_SEASON_END_MONTH = 9;

const COMPACT = "Compact";
const RACER = "Racer";

const WEEKEND_MULTIPLIER = 1.05;
const HIGH_SEASON_MULTIPLIER = 1.15;
const RACER_MULTIPLIER = 1.5;
const LICENSE_MULTIPLIER = 1.3;
const LONG_RENTAL_MULTIPLIER = 0.9;

const YOUNG_LICENSE_SURCHARGE = 15;
const ONE_WAY_FEE = 25;

const MINIMUM_RENTAL_AGE = 18;
const MAX_YOUNG_DRIVER_AGE = 21;
const RACER_SURCHARGE_MAX_AGE = 25;

const MINIMUM_LICENSE_YEARS = 1;
const TWO_YEAR_LICENSE_LIMIT = 2;
const THREE_YEAR_LICENSE_LIMIT = 3;

const LONG_RENTAL_DAYS = 10;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDate(date) {
  return new Date(`${date}T00:00:00Z`);
}

function isHighSeasonMonth(month) {
  return (
    month >= HIGH_SEASON_START_MONTH
    && month <= HIGH_SEASON_END_MONTH
  );
}

function getSeason(pickupDate, dropoffDate) {
  let currentDate = toUtcDate(pickupDate);
  const endDate = toUtcDate(dropoffDate);

  while (currentDate <= endDate) {
    if (isHighSeasonMonth(currentDate.getUTCMonth())) {
      return HIGH_SEASON;
    }

    currentDate = new Date(currentDate.getTime() + ONE_DAY_MS);
  }

  return LOW_SEASON;
}

function calculateRentalDays(pickupDate, dropoffDate) {
  const startDate = toUtcDate(pickupDate);
  const endDate = toUtcDate(dropoffDate);

  return Math.round(
    Math.abs(endDate - startDate) / ONE_DAY_MS
  ) + 1;
}

function countWeekendDays(pickupDate, dropoffDate) {
  let currentDate = toUtcDate(pickupDate);
  const endDate = toUtcDate(dropoffDate);
  let weekendDays = 0;

  while (currentDate <= endDate) {
    const day = currentDate.getUTCDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
      weekendDays += 1;
    }

    currentDate = new Date(
      currentDate.getTime() + ONE_DAY_MS
    );
  }

  return weekendDays;
}

function validateEligibility(carType, age, licenseYears) {
  if (age < MINIMUM_RENTAL_AGE) {
    return "Driver too young - cannot quote the price";
  }

  if (age <= MAX_YOUNG_DRIVER_AGE && carType !== COMPACT) {
    return `Drivers 21 y/o or less can only rent ${COMPACT} vehicles`;
  }

  if (licenseYears < MINIMUM_LICENSE_YEARS) {
    return "Individuals holding a driver's license for less than a year are ineligible to rent";
  }

  return null;
}

function calculateDailyRate(age, licenseYears, season) {
  let dailyRate = age;

  if (
    licenseYears < THREE_YEAR_LICENSE_LIMIT
    && season === HIGH_SEASON
  ) {
    dailyRate += YOUNG_LICENSE_SURCHARGE;
  }

  return dailyRate;
}

function calculateTotalPrice(
  pickup,
  dropoff,
  pickupDate,
  dropoffDate,
  carType,
  age,
  licenseYears,
  dailyRate,
  season,
  rentalDays
) {
  const weekendDays = countWeekendDays(
    pickupDate,
    dropoffDate
  );

  const weekdayDays = rentalDays - weekendDays;

  let totalPrice = weekdayDays * dailyRate
    + weekendDays * dailyRate * WEEKEND_MULTIPLIER;

  if (season === HIGH_SEASON) {
    totalPrice *= HIGH_SEASON_MULTIPLIER;
  }

  if (
    carType === RACER
    && age <= RACER_SURCHARGE_MAX_AGE
    && season === HIGH_SEASON
  ) {
    totalPrice *= RACER_MULTIPLIER;
  }

  if (licenseYears < TWO_YEAR_LICENSE_LIMIT) {
    totalPrice *= LICENSE_MULTIPLIER;
  }

  if (
    rentalDays > LONG_RENTAL_DAYS
    && season === LOW_SEASON
  ) {
    totalPrice *= LONG_RENTAL_MULTIPLIER;
  }

  if (pickup !== dropoff) {
    totalPrice += ONE_WAY_FEE;
  }

  return totalPrice;
}

function price(
  pickup,
  dropoff,
  pickupDate,
  dropoffDate,
  carType,
  age,
  licenseYears
) {
  const driverAge = Number(age);
  const yearsLicensed = Number(licenseYears);

  const eligibilityError = validateEligibility(
    carType,
    driverAge,
    yearsLicensed
  );

  if (eligibilityError) {
    return eligibilityError;
  }

  const rentalDays = calculateRentalDays(
    pickupDate,
    dropoffDate
  );

  const season = getSeason(
    pickupDate,
    dropoffDate
  );

  const dailyRate = calculateDailyRate(
    driverAge,
    yearsLicensed,
    season
  );

  const totalPrice = calculateTotalPrice(
    pickup,
    dropoff,
    pickupDate,
    dropoffDate,
    carType,
    driverAge,
    yearsLicensed,
    dailyRate,
    season,
    rentalDays
  );

  return `$${totalPrice.toFixed(2)}`;
}

module.exports = {
  price
};
