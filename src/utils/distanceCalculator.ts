export const distanceCalculator = (
  riderCoordinates: { latitude: number; longitude: number },
  driverCoordinates: { latitude: number; longitude: number }
): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const R = 6371;
  const dLat = toRadians(
    driverCoordinates.latitude - riderCoordinates.latitude
  );
  const dLon = toRadians(
    driverCoordinates.longitude - riderCoordinates.longitude
  );

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(riderCoordinates.latitude)) *
      Math.cos(toRadians(driverCoordinates.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
