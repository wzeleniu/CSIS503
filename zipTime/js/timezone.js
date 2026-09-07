async function getZipLocation(zipCode) {
  const response = await fetch(
    `${APP_CONFIG.zipApiBase}/${encodeURIComponent(zipCode)}`
  );

  if (!response.ok) {
    throw new Error("ZIP code not found.");
  }

  const data = await response.json();

  if (!data.places || data.places.length === 0) {
    throw new Error("No location was found for that ZIP code.");
  }

  const place = data.places[0];

  return {
    zipCode,
    city: place["place name"],
    state: place["state"],
    stateAbbreviation: place["state abbreviation"],
    latitude: Number(place.latitude),
    longitude: Number(place.longitude)
  };
}

async function getTimezone(latitude, longitude) {
  const url =
    `${APP_CONFIG.timezoneApiBase}?latitude=${encodeURIComponent(latitude)}` +
    `&longitude=${encodeURIComponent(longitude)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to determine the timezone.");
  }

  const data = await response.json();

  // TimeAPI.io normally returns timeZone. Support common casing variants too.
  const timeZone =
    data.timeZone ||
    data.timezone ||
    data.id ||
    data.zoneName;

  if (!timeZone) {
    throw new Error("The timezone service returned no timezone.");
  }

  return {
    timeZone,
    abbreviation: data.abbreviation || data.shortName || "",
    currentLocalTime: data.currentLocalTime || data.currentLocalTimeString || null
  };
}

function getTimeZoneDisplayName(timeZone) {
  const names = {
    "America/New_York": "Eastern Time",
    "America/Detroit": "Eastern Time",
    "America/Chicago": "Central Time",
    "America/Denver": "Mountain Time",
    "America/Phoenix": "Mountain Standard Time",
    "America/Los_Angeles": "Pacific Time",
    "America/Anchorage": "Alaska Time",
    "Pacific/Honolulu": "Hawaii-Aleutian Time"
  };

  return names[timeZone] || timeZone;
}
