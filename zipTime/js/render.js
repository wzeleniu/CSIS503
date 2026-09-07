const elements = {
  form: document.getElementById("zip-form"),
  zipInput: document.getElementById("zip-code"),
  searchButton: document.getElementById("search-button"),
  status: document.getElementById("status"),
  result: document.getElementById("result"),
  locationName: document.getElementById("location-name"),
  locationState: document.getElementById("location-state"),
  localTime: document.getElementById("local-time"),
  localDate: document.getElementById("local-date"),
  timezoneName: document.getElementById("timezone-name"),
  timezoneAbbr: document.getElementById("timezone-abbr"),
  utcOffset: document.getElementById("utc-offset")
};

function setStatus(message, isError = false) {
  elements.status.textContent = message;
  elements.status.classList.toggle("error", isError);
}

function setLoading(isLoading) {
  elements.searchButton.disabled = isLoading;
  elements.searchButton.textContent = isLoading ? "Searching..." : "Look Up";
}

function showResult(location, timezone) {
  elements.result.classList.remove("hidden");

  elements.locationName.textContent = location.city;
  elements.locationState.textContent =
    `${location.state} (${location.stateAbbreviation}) • ZIP ${location.zipCode}`;

  elements.timezoneName.textContent =
    `${getTimeZoneDisplayName(timezone.timeZone)} (${timezone.timeZone})`;

  elements.timezoneAbbr.textContent =
    timezone.abbreviation || getAbbreviationFromDate(timezone.timeZone);

  updateClock(timezone.timeZone);
}

function getAbbreviationFromDate(timeZone) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short"
    }).formatToParts(new Date());

    return parts.find((part) => part.type === "timeZoneName")?.value || "—";
  } catch {
    return "—";
  }
}

function updateClock(timeZone) {
  const now = new Date();

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: APP_CONFIG.timeFormat === "12-hour"
  }).format(now);

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(now);

  const offset = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset"
  })
    .formatToParts(now)
    .find((part) => part.type === "timeZoneName")?.value || "UTC";

  elements.localTime.textContent = time;
  elements.localDate.textContent = date;
  elements.utcOffset.textContent = offset;
}
