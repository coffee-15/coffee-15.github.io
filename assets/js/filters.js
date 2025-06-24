document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".filters button");
  const posts = document.querySelectorAll(".post-card");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      // Highlight the active button
      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      posts.forEach(post => {
        const tagString = post.getAttribute("data-tag") || "";
        const tagList = tagString.split(", ").map(t => t.trim());

        if (filter === "all" || tagList.includes(filter)) {
          post.style.display = "flex"; // or "block" depending on your layout
        } else {
          post.style.display = "none";
        }
      });
    });
  });
});