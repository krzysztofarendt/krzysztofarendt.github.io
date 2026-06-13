const statusElement = document.querySelector("#runtime-status");

if (statusElement) {
  const deployedAt = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  statusElement.textContent = `Static HTML, CSS, and JavaScript are working. Checked at ${deployedAt}.`;
}
