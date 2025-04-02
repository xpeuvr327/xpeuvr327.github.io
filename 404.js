window.onload = function() {
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', async function(event) {
                event.preventDefault();
    
                const href = anchor.getAttribute('href');
                if (!href) return; 
    
                try {
                    const response = await fetch(href);
                    if (response.ok) {
                        window.location.href = href;
                    } else {
                        window.location.href = '/404.html';
                    }
                } catch (error) {
                    window.location.href = href;
                }
            });
        });
};