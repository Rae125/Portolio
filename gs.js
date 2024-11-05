// gs.js

document.addEventListener("DOMContentLoaded", function () {
    // Verwijder het loading-scherm wanneer de hele pagina is geladen
    window.onload = function () {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    };

    // GSAP & ScrollTrigger-initialisatie
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);

        // Klokfunctie
        function updateClock() {
            const clockElement = document.getElementById('clock');
            if (!clockElement) return;

            const currentTime = new Date();

            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            let seconds = currentTime.getSeconds();

            // Voeg een '0' toe als de waarde minder is dan 10
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            const timezoneOffset = -currentTime.getTimezoneOffset() / 60;
            const offsetString = timezoneOffset >= 0 ? `+${timezoneOffset}` : timezoneOffset;

            clockElement.textContent = `${hours}:${minutes}:${seconds} UTC ${offsetString}`;
        }

        // Update de klok elke seconde
        setInterval(updateClock, 1000);
        updateClock();

        // Selecteer de paragraaf en splits de tekst in letters
        const paragraph = document.querySelector('.text-box p');
        if (paragraph) {
            const letters = paragraph.innerText.split('');
            paragraph.innerHTML = letters.map(letter => `<span>${letter}</span>`).join('');

            const scrub = 1;
            const trigger = '.text-box';

            // Stel GSAP in om de letters individueel te animeren
            gsap.set('p > span', {
                '--progress': 0,
                color: 'transparent',
            });

            // Animatie om de letters in te laten komen
            gsap.to('p > span', {
                '--progress': 1,
                color: 'white',
                scrollTrigger: {
                    trigger: trigger,
                    scrub: scrub,
                    start: 'bottom bottom', // Start wanneer het element onderaan het scherm komt
                    end: 'top center', // Eindigt wanneer het element bovenaan het scherm is
                },
                stagger: {
                    each: 0.02, // Tijd tussen elke letteranimatie
                    from: 'start'
                }
            });

            // Debug markers toevoegen
           // ScrollTrigger.create({
           //     trigger: trigger,
           //     start: 'bottom bottom', // Start wanneer het element onderaan het scherm komt
            //    end: 'top top', // Eindigt wanneer het element bovenaan het scherm is
           // //    markers: true,
           // });
        }
    }

    // GSAP fade-in voor foto's met ScrollTrigger
    gsap.from(".bottom-right-photo, .top-left-photo, .bottom-left-photo", {
        duration: 1,  // Duur van de animatie in seconden
        opacity: 0,     // Start van een opacity van 0 (onzichtbaar)
        stagger: 0.5,   // Interval tussen het faden van elke afbeelding
        ease: "power2.out", // Voeg een easing toe voor een mooi effect
        scrollTrigger: {
            trigger: ".container3",  // De container die als trigger dient
            start: "top top",   // Start wanneer de container onderaan het scherm is
            end: "top center",           // Eindigt wanneer de container bovenaan het scherm is
            toggleActions: "play" // Speel af bij naar beneden scrollen, terug naar start bij naar boven scrollen
        }
    });

    gsap.from(".top-right-photo", {
        duration: 1,  // Duur van de animatie in seconden
        opacity: 0,     // Start van een opacity van 0 (onzichtbaar)
        stagger: 0.5,   // Interval tussen het faden van elke afbeelding
        ease: "power2.out", // Voeg een easing toe voor een mooi effect
        scrollTrigger: {
            trigger: ".container2",  // De container die als trigger dient
            start: "bottom  top",   // Start wanneer de container onderaan het scherm is
            end: "top center",           // Eindigt wanneer de container bovenaan het scherm is
            toggleActions: "play" // Speel af bij naar beneden scrollen, terug naar start bij naar boven scrollen
        }
    });

    // Cursor-ring functionaliteit
    const cursorRing = document.getElementById('cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let prevMouseX = 0, prevMouseY = 0;
    let currentScale = 0;
    let currentAngle = 0;
    const speed = 0.1; // Aangepast voor betere responsiviteit
    const throttleRate = 10; // Throttle rate in milliseconden
    let lastExecution = Date.now();

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastExecution > throttleRate) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastExecution = now;
        }
    });

    function animate() {
        // Beweeg de ring naar de muis
        let dx = mouseX - ringX;
        let dy = mouseY - ringY;
        ringX += dx * speed;
        ringY += dy * speed;

        // Bereken de verandering in muispositie
        let deltaMouseX = mouseX - prevMouseX;
        let deltaMouseY = mouseY - prevMouseY;
        prevMouseX = mouseX;
        prevMouseY = mouseY;

        // Bereken de hoek en pas de rotatie aan
        const angle = Math.atan2(deltaMouseY, deltaMouseX) * 180 / Math.PI;
        currentAngle = angle;

        // Pas de schaal van de ring aan op basis van de muisbeweging
        const mouseVelocity = Math.sqrt(deltaMouseX**2 + deltaMouseY**2);
        const scaleValue = mouseVelocity * 0.01;
        currentScale += (scaleValue - currentScale) * speed;

        // Stel de transform eigenschappen van de ring in
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) rotate(${currentAngle}deg) scale(${1 + currentScale}, ${1 - currentScale})`;

        // Vraag de volgende frame aan voor de animatie
        requestAnimationFrame(animate);
    }

    animate();

    if (typeof gsap !== "undefined") {
        gsap.to(".project-card", {
            duration: 1.5, // Duration of the fade-in animation
            opacity: 1,    // Set opacity to 1 (fully visible)
            y: 0,          // Move the element back to its original position
            ease: "power2.out", // Easing effect for a smooth animation
            stagger: 0.3,  // Stagger each link animation for a cascading effect
            scrollTrigger: {
                trigger: ".project-container", // Element that triggers the animation
                start: "top 75%", // Animation starts when the element is at 80% from the top of the viewport
                end: "top 20%", // Animation ends when the element is at 20% from the top of the viewport
                toggleActions: "play none none none" // Play animation on scroll
            }
        });
    }
});
