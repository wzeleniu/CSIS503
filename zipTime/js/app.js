let selectedTimeZone = null;

async function handleZipLookup(event) {
  event.preventDefault();

  const zipCode = elements.zipInput.value.trim();

  if (!/^\d{5}$/.test(zipCode)) {
    setStatus("Please enter a valid 5-digit U.S. ZIP code.", true);
    elements.result.classList.add("hidden");
    return;
  }

  setLoading(true);
  setStatus("Looking up ZIP code...");

  try {
    const location = await getZipLocation(zipCode);

    setStatus("Finding timezone...");

    const timezone = await getTimezone(
      location.latitude,
      location.longitude
    );

    selectedTimeZone = timezone.timeZone;

    showResult(location, timezone);
    setStatus("Time updated.");
  } catch (error) {
    console.error(error);
    selectedTimeZone = null;
    elements.result.classList.add("hidden");
    setStatus(error.message || "Something went wrong.", true);
  } finally {
    setLoading(false);
  }
}

elements.form.addEventListener("submit", handleZipLookup);

elements.zipInput.addEventListener("input", () => {
  elements.zipInput.value = elements.zipInput.value
    .replace(/\D/g, "")
    .slice(0, 5);
});

// Keep the displayed clock synchronized with the real clock.
setInterval(() => {
  if (selectedTimeZone) {
    updateClock(selectedTimeZone);
  }
}, 1000);

// Register the PWA service worker.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
