function toggleClassContents(classContainer) { 
    let contents = classContainer.querySelector(".classHideShowContents"); 
    contents.style.display = (contents.style.display === "block") ? "none":"block";
}