document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Peata vormi tavapärane käitumine

    const username = document.getElementById('username').value.trim(); // Kasutajanimi
    const password = document.getElementById('password').value.trim(); // Parool

    // Kontrolli, kas mõlemad väljad on täidetud
    if (!username || !password) {
        alert('Palun sisesta nii kasutajanimi kui ka parool!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5173/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserName: username, Password: password }), // Saada andmed serverisse
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message); // Logimine õnnestus
            console.log('Kasutaja info:', result.user);
            // Võid siia lisada koodi, mis suunab kasutaja järgmisele lehele
        } else {
            alert(result.error); // Logimine ebaõnnestus
        }
    } catch (error) {
        alert('Ühendus ebaõnnestus');
        console.error('Ühendustõrge:', error);
    }
});