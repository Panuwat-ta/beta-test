
        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', function() {
            document.getElementById('navLinks').classList.toggle('active');
        });

        function setActive(element) {
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            element.classList.add('active');
        }
