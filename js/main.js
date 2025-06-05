document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".scroll-link").forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href");
            if (targetId) {
                document.querySelector(targetId)?.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    document.querySelectorAll(".accordion-header").forEach((header) => {
        header.addEventListener("click", function () {
            const content = this.nextElementSibling;
            const isOpen = content.classList.contains("block");
            const icon = this.querySelector('.fa');

            // Close all open accordions
            document.querySelectorAll(".accordion-item").forEach((item) => {
                item.classList.remove('border-accent');
                item.classList.add('border-accent/70');

                const header = item.querySelector('.accordion-header');
                header.classList.remove('bg-accent');
                header.classList.add('bg-accent/70');

                const icon = item.querySelector('.fa');
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');

                const content = item.querySelector('.accordion-content');
                content.classList.remove("max-h-fit", "opacity-100");
                content.classList.add("max-h-0", "opacity-0");
            });

            // Toggle clicked one
            if (!isOpen) {
                this.parentNode.classList.remove('border-accent/70');
                this.parentNode.classList.add('border-accent');

                this.classList.remove('bg-accent/70');
                this.classList.add('bg-accent');

                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');

                content.classList.remove("max-h-0", "opacity-0");
                content.classList.add("max-h-fit", "opacity-100");
            }
        });
    });

    document.querySelector('main').addEventListener("scrollsnapchange", (event) => {
        const btn = document.querySelector('#back-to-top-btn');

        if (event.snapTargetBlock.id === 'hero') {
            btn.classList.add('hidden');
        } else {
            btn.classList.remove('hidden');
        }

        document.querySelectorAll('header nav a').forEach((link) => {
            if (link.getAttribute('href') === `#${event.snapTargetBlock.id}`) {
                link.classList.add('text-accent', '!border-accent');
            } else {
                link.classList.remove('text-accent', '!border-accent');
            }
        });
    });

    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-menu");
    const mobileMenu = document.getElementById("mobile-menu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.remove("translate-x-full");
    });

    closeBtn.addEventListener("click", () => {
        mobileMenu.classList.add("translate-x-full");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        if (!mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
            mobileMenu.classList.add("translate-x-full");
        }
    });

    function showMessage(message, type) {
        const block = document.getElementById('btn-contact-message');
        block.textContent = message;
        block.classList.remove('hidden');
        if (type === 'success') {
            block.classList.add(['bg-green-600', 'text-green-100']);
        } else if (type === 'error') {
            block.classList.add(['bg-red-600', 'text-red-100']);
        }
    }

    document.getElementById('contact-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const submitButton = document.getElementById('btn-contact-submit');

        // Get form data
        const formData = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };

        try {
            submitButton.disabled = true;
            submitButton.classList.add('opacity-50');
            submitButton.textContent = "Sending...";

            const response = await fetch('https://z5moudc4tg.execute-api.eu-central-1.amazonaws.com/portfolio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
            submitButton.classList.remove('opacity-50');
        }
    });
});
