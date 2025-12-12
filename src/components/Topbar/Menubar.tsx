const Menubar = () => {
    const barCat = ["Menu", "Home", "Tools"];
    //const menuData = ["Back", "New", "Open", "Save", "Import", "Export"];
    return (
        <menu className="menu-bar">
            {barCat.map((category) => {
                return (
                    <nav className="menu-item">
                        {category}
                    </nav>
                );
            })}
        </menu>
    )
}

export default Menubar