function clean()
{
    location.reload();
}

function show(menu)
{
    let element = document.getElementById(menu);
    if(element)
    {
        element.style.display = "block";
    }
}