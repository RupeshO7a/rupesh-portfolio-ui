window.addEventListener('load', () => {
            // Theme Toggle Logic
            const themeToggleBtn = document.getElementById('theme-toggle');
            const currentTheme = localStorage.getItem('theme') || 'light';
            if (currentTheme === 'dark') {
                document.documentElement.classList.add('dark');
                if (themeToggleBtn) themeToggleBtn.innerText = '[ ☼ ]';
            }
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    document.documentElement.classList.toggle('dark');
                    if (document.documentElement.classList.contains('dark')) {
                        localStorage.setItem('theme', 'dark');
                        themeToggleBtn.innerText = '[ ☼ ]';
                    } else {
                        localStorage.setItem('theme', 'light');
                        themeToggleBtn.innerText = '[ ☾ ]';
                    }
                });
            }

            // Intro Text Typing Effect Setup
            const introTextEl = document.getElementById('intro-text');
            let originalIntroText = "";
            if (introTextEl) {
                originalIntroText = introTextEl.innerText.trim();
                introTextEl.innerText = "";
            }

            function typeIntro() {
                if (!introTextEl || !originalIntroText) return;
                let i = 0;
                function typeChar() {
                    if (i < originalIntroText.length) {
                        introTextEl.innerHTML = originalIntroText.substring(0, i + 1) + '<span class="cursor-blink"></span>';
                        i++;
                        setTimeout(typeChar, 20 + Math.random() * 30);
                    } else {
                        introTextEl.innerHTML = originalIntroText;
                    }
                }
                setTimeout(typeChar, 500);
            }
            const loader = document.getElementById('loader');
            const bootText = document.getElementById('boot-text');
            const bootBtnContainer = document.getElementById('boot-btn-container');
            const startBootBtn = document.getElementById('start-boot-btn');

            if (loader && bootText && startBootBtn) {
                const bootSequence = [
                    "INITIATING BOOT SEQUENCE...",
                    "MOUNTING FILE SYSTEM [OK]",
                    "LOADING NEURAL WEIGHTS [OK]",
                    "ESTABLISHING SECURE CONNECTION...",
                    "ACCESS GRANTED. WELCOME, USER."
                ];

                let seqIndex = 0;

                function typeLine() {
                    if (seqIndex < bootSequence.length) {
                        const line = document.createElement('div');
                        line.innerText = "> " + bootSequence[seqIndex];
                        bootText.appendChild(line);

                        // Keep cursor at the end
                        const cursors = bootText.querySelectorAll('.cursor-blink');
                        cursors.forEach(c => c.remove());
                        const cursor = document.createElement('span');
                        cursor.className = 'cursor-blink';
                        bootText.appendChild(cursor);

                        seqIndex++;
                        setTimeout(typeLine, 300 + Math.random() * 300); // Random delay between lines
                    } else {
                        // Finish sequence
                        setTimeout(() => {
                            loader.style.opacity = '0';
                            setTimeout(() => {
                                loader.style.display = 'none';
                                revealObserver.observe(document.body);
                                typeIntro();
                            }, 500);
                        }, 600);
                    }
                }

                startBootBtn.addEventListener('click', () => {
                    bootBtnContainer.style.display = 'none';
                    bootText.style.display = 'block';
                    setTimeout(typeLine, 200);
                });
            } else {
                revealObserver.observe(document.body);
                typeIntro();
            }
        });

        window.addEventListener('scroll', () => {
            const scrollWin = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollWin / docHeight) * 100;
            const progress = document.getElementById('scroll-progress');
            if (progress) {
                progress.style.width = scrolled + '%';
            }
        });

        const cursor = document.getElementById('cursor');
        const cursorText = document.getElementById('cursor-text');

        if (cursor && cursorText) {
            document.addEventListener('mousemove', (e) => {
                cursor.style.left = e.clientX + 'px';
                cursor.style.top = e.clientY + 'px';
            });

            const interactiveElements = document.querySelectorAll('a, button, .cursor-hover, .project-nav-item');

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.classList.add('active');
                    if (el.hasAttribute('data-cursor-text')) {
                        cursorText.innerText = el.getAttribute('data-cursor-text');
                        cursorText.style.opacity = '1';
                    }
                });
                el.addEventListener('mouseleave', () => {
                    cursor.classList.remove('active');
                    cursorText.style.opacity = '0';
                });
            });
        }

        const canvas = document.getElementById('particle-canvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let particlesArray = [];

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                    this.vx = (Math.random() - 0.5) * 1.0;
                    this.vy = (Math.random() - 0.5) * 1.0;
                }

                update() {
                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = '#111111';
                    ctx.fill();
                }
            }

            function initParticles() {
                particlesArray = [];
                let numberOfParticles = Math.floor((canvas.width * canvas.height) / 25000);
                if (numberOfParticles > 70) numberOfParticles = 70;

                for (let i = 0; i < numberOfParticles; i++) {
                    particlesArray.push(new Particle());
                }
            }

            function setCanvasSize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                initParticles();
            }
            setCanvasSize();
            window.addEventListener('resize', setCanvasSize);

            let mousePos = { x: null, y: null, radius: 150 };
            document.addEventListener('mousemove', (e) => {
                const overContent = e.target.closest('.shadow-2d, .shadow-2d-sm, .shadow-2d-hover, nav, footer, .project-nav-item');
                if (overContent) {
                    mousePos.x = null;
                    mousePos.y = null;
                } else {
                    mousePos.x = e.clientX;
                    mousePos.y = e.clientY;
                }
            });
            document.addEventListener('mouseleave', () => {
                mousePos.x = null;
                mousePos.y = null;
            });

            function connect() {
                let opacityValue = 1;
                for (let a = 0; a < particlesArray.length; a++) {
                    for (let b = a; b < particlesArray.length; b++) {
                        let dx = particlesArray[a].x - particlesArray[b].x;
                        let dy = particlesArray[a].y - particlesArray[b].y;
                        let distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 120) {
                            opacityValue = 1 - (distance / 120);
                            ctx.strokeStyle = 'rgba(17, 17, 17,' + opacityValue * 0.5 + ')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                            ctx.stroke();
                        }
                    }

                    if (mousePos.x != null && mousePos.y != null) {
                        let dx = particlesArray[a].x - mousePos.x;
                        let dy = particlesArray[a].y - mousePos.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < mousePos.radius) {
                            opacityValue = 1 - (distance / mousePos.radius);
                            ctx.strokeStyle = 'rgba(17, 17, 17,' + opacityValue * 0.5 + ')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                            ctx.lineTo(mousePos.x, mousePos.y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < particlesArray.length; i++) {
                    particlesArray[i].update();
                    particlesArray[i].draw();
                }
                connect();
                requestAnimationFrame(animateParticles);
            }

            initParticles();
            animateParticles();
        }

        const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });

        const projectData = [
            {
                title: "MedChain",
                category: "Blockchain Healthcare Exchange",
                date: "Jan 2026 - Apr 2026",
                desc: "A blockchain-based healthcare data exchange built on Ethereum & Solidity — enabling secure, tamper-proof sharing of patient records across multiple institutions with patient-controlled consent.",
                bullets: [
                    "Hybrid MongoDB + blockchain architecture with multi-layer hashing (SHA-256 + BLAKE2b).",
                    "Reduced on-chain storage cost by 70-90% via Merkle-tree optimization.",
                    "AI-driven anomaly detection (Isolation Forest) + smart-contract consent control."
                ],
                link: "https://github.com/RupeshO7a/Medchain",
                tech: ["Ethereum", "Solidity", "MongoDB", "Smart Contracts", "Merkle Trees", "bcrypt", "ethers.js", "Web3", "AI Detection"],
                icon: "fa-link"
            },
            {
                title: "GRIPS",
                category: "Glove-Based Impact System",
                date: "Jan 2026 - Apr 2026",
                desc: "AI-powered wearable cricket analytics system using smart glove sensors, TGNN, and edge AI for real-time biomechanical shot classification and performance analysis.",
                bullets: [
                    "Architected an AI-powered wearable cricket analytics system using TGNN, multi-modal sensor fusion, and edge inference.",
                    "Engineered a low-latency IoT pipeline with ESP32-C3, FSR sensors, and MPU6050 IMU.",
                    "Implemented Physics-Informed AI and Federated Edge Learning for privacy-preserving distributed training."
                ],
                link: "https://github.com/RupeshO7a/GRIPS---Glove-based-Real-time-Impact-and-Pattern-System",
                tech: ["Python", "PyTorch", "Flask", "React", "ESP32", "IoT", "GNN", "Federated Learning"],
                icon: "fa-hand-rock"
            },
            {
                title: "PRISM",
                category: "Resource & Inventory",
                date: "Aug 2025 - Nov 2025",
                desc: "A full-stack role-based platform for managing military personnel, armory inventory and operational readiness — with real-time monitoring dashboards and a hardened security model.",
                bullets: [
                    "Engineered RBAC and audit trails for accountability across roles.",
                    "Real-time dashboards for armory inventory & readiness tracking.",
                    "Centralized control with secure multi-tier access flows."
                ],
                link: "https://github.com/RupeshO7a/PRISM",
                tech: ["Full Stack", "RBAC", "Dashboards", "Security"],
                icon: "fa-shield-alt"
            }
        ];

        const navItems = document.querySelectorAll('.project-nav-item');
        const displayContent = document.getElementById('project-display-content');

        function renderProject(index) {
            const data = projectData[index];
            if (!displayContent) return;

            displayContent.classList.remove('opacity-100', 'translate-y-0');
            displayContent.classList.add('opacity-0', 'translate-y-4');

            setTimeout(() => {
                const techTags = data.tech.map((tech, i) =>
                    `<span class="border-2 border-ink px-3 py-1 text-xs md:text-sm font-bold ${i === 0 ? 'bg-ink text-paper' : 'bg-bgLight'} shadow-2d-sm">${tech}</span>`
                ).join('');

                const bulletPoints = data.bullets.map(bullet =>
                    `<li class="flex items-start gap-3 font-medium text-base md:text-lg">
                        <div class="w-2 h-2 bg-ink mt-2 shrink-0 shadow-2d-sm"></div>
                        <p>${bullet}</p>
                    </li>`
                ).join('');

                displayContent.innerHTML = `
                    <div class="flex justify-between items-start mb-6 relative z-20">
                        <div>
                            <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                <h3 class="text-3xl md:text-5xl font-display font-black uppercase">${data.title}</h3>
                                <span class="font-mono text-xs font-bold bg-ink text-paper px-2 py-1 w-fit"><i class="far fa-calendar-alt mr-1"></i> ${data.date}</span>
                            </div>
                            <p class="font-mono text-xs md:text-sm font-bold uppercase border-2 border-ink inline-block px-3 py-1 bg-paper shadow-2d-sm">${data.category}</p>
                        </div>
                        <a href="${data.link}" target="_blank" class="text-ink hover:scale-110 transition-transform bg-paper border-2 border-ink p-3 rounded-full shadow-2d-sm cursor-hover shrink-0" data-cursor-text="Code">
                            <i class="fab fa-github text-2xl md:text-3xl"></i>
                        </a>
                    </div>
                    <p class="text-lg md:text-xl font-bold mb-4 leading-relaxed relative z-20">
                        ${data.desc}
                    </p>
                    <ul class="space-y-3 mb-8 flex-grow relative z-20">
                        ${bulletPoints}
                    </ul>
                    <div class="flex flex-wrap gap-2 mt-auto border-t-4 border-ink border-dashed pt-6 relative z-20">
                        ${techTags}
                    </div>
                    <i class="fas ${data.icon} absolute -bottom-10 -right-10 text-[10rem] md:text-[14rem] text-ink/5 pointer-events-none group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 z-0"></i>
                `;

                displayContent.classList.remove('opacity-0', 'translate-y-4');
                displayContent.classList.add('opacity-100', 'translate-y-0');
            }, 300);
        }

        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const index = parseInt(item.getAttribute('data-index'));
                renderProject(index);
            });
        });

        // Magnetic Buttons
        const magneticBtns = document.querySelectorAll('.magnetic-btn');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - h;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });

        // Back to Top Logic
        const backToTopBtn = document.getElementById('back-to-top');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }