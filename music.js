// Music-specific enhancements that sit beside the original player logic.
export function enhanceMusicAccessibility() {
  const player = document.getElementById("musicPlayer");
  const toggle = document.getElementById("musicToggleDisc");
  const play = document.getElementById("playerPlayBtn");
  const volume = document.getElementById("playerVolume");

  if (player) player.setAttribute("aria-label", "Music player");
  if (toggle) toggle.setAttribute("aria-expanded", "false");
  if (play) play.setAttribute("title", "Play or pause music");
  if (volume) volume.setAttribute("title", "Music volume");

  toggle?.addEventListener("click", () => {
    const panel = document.getElementById("playerPanel");
    toggle.setAttribute("aria-expanded", String(panel?.classList.contains("open")));
  });
}
