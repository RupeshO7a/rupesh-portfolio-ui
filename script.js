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

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
        reveals.forEach(el => {
            scrollObserver.observe(el);
        });

        // Timeline Node Glow Logic
        const timelineNodes = document.querySelectorAll('#experience .rounded-full.absolute, #education .rounded-full.absolute');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.boxShadow = '0 0 15px var(--color-ink)';
                    entry.target.style.transition = 'box-shadow 0.5s ease-out, transform 0.5s ease';
                    entry.target.style.transform = 'scale(1.2)';
                } else {
                    entry.target.style.boxShadow = '0 0 0px var(--color-ink)';
                    entry.target.style.transform = 'scale(1)';
                }
            });
        }, { threshold: 1.0 });

        timelineNodes.forEach(node => timelineObserver.observe(node));

        const projectData = [
            {
                title: "MedChain",
                id: "01",
                filterCategory: ["Blockchain", "Full Stack"],
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
                id: "02",
                filterCategory: ["AI/ML"],
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
                id: "03",
                filterCategory: ["AI/ML", "Full Stack"],
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

        let currentCategory = "All";

        const projectNavContainer = document.getElementById('project-nav-container');
        const projectDisplayContent = document.getElementById('project-display-content');

        function renderProjectNav() {
            if (!projectNavContainer) return;
            projectNavContainer.innerHTML = '';
            
            const filteredProjects = currentCategory === "All" 
                ? projectData 
                : projectData.filter(p => p.filterCategory.includes(currentCategory));

            filteredProjects.forEach((proj, i) => {
                const div = document.createElement('div');
                div.className = "project-nav-item group flex items-center gap-6 cursor-pointer reveal-left";
                div.style.transitionDelay = `${i * 150}ms`;
                div.setAttribute('data-index', projectData.indexOf(proj));

                div.innerHTML = `
                    <span class="text-7xl md:text-8xl font-display font-black text-stroke group-hover:text-ink group-hover:[-webkit-text-stroke:0px] transition-all duration-300 transform group-hover:scale-110 origin-left">${proj.id}</span>
                    <span class="text-xl md:text-2xl font-bold uppercase opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out">${proj.title}</span>
                `;

                div.addEventListener('mouseenter', () => {
                    renderProject(projectData.indexOf(proj));
                });

                projectNavContainer.appendChild(div);
                setTimeout(() => div.classList.add('active'), 50);
            });

            if (filteredProjects.length > 0) {
                renderProject(projectData.indexOf(filteredProjects[0]));
            } else {
                projectDisplayContent.innerHTML = `<h3 class="text-2xl font-bold font-mono">No projects found for this category.</h3>`;
            }
        }

        function renderProject(index) {
            const data = projectData[index];
            if (!data || !projectDisplayContent) return;

            projectDisplayContent.style.opacity = 0;
            projectDisplayContent.style.transform = 'translateY(10px)';

            setTimeout(() => {
                const techTags = data.tech.map((tech, i) =>
                    `<span class="border-2 border-ink px-3 py-1 text-xs md:text-sm font-bold ${i === 0 ? 'bg-ink text-paper' : 'bg-bgLight'} shadow-2d-sm">${tech}</span>`
                ).join('');

                const bulletPoints = data.bullets.map(bullet =>
                    `<li class="flex items-start gap-3 font-medium text-base md:text-lg text-ink/80">
                        <div class="w-2 h-2 bg-ink mt-2 shrink-0 shadow-2d-sm"></div>
                        <p>${bullet}</p>
                    </li>`
                ).join('');

                projectDisplayContent.innerHTML = `
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
                projectDisplayContent.style.opacity = 1;
                projectDisplayContent.style.transform = 'translateY(0)';
            }, 300);
        }

        // Initialize Project Nav
        if (projectNavContainer) {
            renderProjectNav();
        }

        // Filter Logic
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => {
                    b.classList.remove('bg-ink', 'text-paper', 'active');
                    b.classList.add('bg-paper', 'text-ink');
                });
                e.target.classList.remove('bg-paper', 'text-ink');
                e.target.classList.add('bg-ink', 'text-paper', 'active');
                
                currentCategory = e.target.getAttribute('data-filter');
                renderProjectNav();
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

        // --- Chart.js Radar Initialization ---
        const chartCanvas = document.getElementById('skillsChart');
        let skillsChart;
        if (chartCanvas && typeof Chart !== 'undefined') {
            const ctx = chartCanvas.getContext('2d');
            
            // Helper to get CSS var color
            const getInkColor = () => getComputedStyle(document.documentElement).getPropertyValue('--color-ink').trim();
            const getPaperColor = () => getComputedStyle(document.documentElement).getPropertyValue('--color-paper').trim();

            const chartConfig = {
                type: 'radar',
                data: {
                    labels: ['Python', 'Machine Learning', 'Data Structures', 'React/Next.js', 'Solidity/Web3', 'SQL/NoSQL'],
                    datasets: [{
                        label: 'Competency Level',
                        data: [95, 88, 90, 85, 80, 85],
                        backgroundColor: 'rgba(17, 17, 17, 0.2)', // Overridden by theme toggle
                        borderColor: getInkColor(),
                        pointBackgroundColor: getPaperColor(),
                        pointBorderColor: getInkColor(),
                        pointHoverBackgroundColor: getInkColor(),
                        pointHoverBorderColor: getPaperColor(),
                        borderWidth: 2,
                    }]
                },
                options: {
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(128, 128, 128, 0.3)' },
                            grid: { color: 'rgba(128, 128, 128, 0.3)' },
                            pointLabels: {
                                color: getInkColor(),
                                font: { family: "'Space Mono', monospace", size: 10, weight: 'bold' }
                            },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    },
                    maintainAspectRatio: false
                }
            };

            skillsChart = new Chart(ctx, chartConfig);

            // Update chart colors on theme toggle
            if (themeToggleBtn) {
                themeToggleBtn.addEventListener('click', () => {
                    setTimeout(() => {
                        const newInk = getInkColor();
                        const newPaper = getPaperColor();
                        skillsChart.data.datasets[0].borderColor = newInk;
                        skillsChart.data.datasets[0].pointBackgroundColor = newPaper;
                        skillsChart.data.datasets[0].pointBorderColor = newInk;
                        skillsChart.data.datasets[0].pointHoverBackgroundColor = newInk;
                        skillsChart.data.datasets[0].pointHoverBorderColor = newPaper;
                        
                        // Fix background color transparency based on dark mode
                        if(document.documentElement.classList.contains('dark')){
                            skillsChart.data.datasets[0].backgroundColor = 'rgba(238, 238, 238, 0.2)'; // Graphite ink
                        } else {
                            skillsChart.data.datasets[0].backgroundColor = 'rgba(17, 17, 17, 0.2)'; // Light ink
                        }

                        skillsChart.options.scales.r.pointLabels.color = newInk;
                        skillsChart.update();
                    }, 50); // slight delay to let CSS var update
                });
            }
            
            // Set initial background correctly
            if(document.documentElement.classList.contains('dark')){
                skillsChart.data.datasets[0].backgroundColor = 'rgba(238, 238, 238, 0.2)';
                skillsChart.update();
            }
        }

        // --- Interactive Terminal Logic ---
        const terminalOverlay = document.getElementById('terminal-overlay');
        const closeTerminalBtn = document.getElementById('close-terminal-btn');
        const terminalInput = document.getElementById('terminal-input');
        const terminalOutput = document.getElementById('terminal-output');

        function printToTerminal(text, isHtml = false) {
            const p = document.createElement('p');
            if(isHtml) p.innerHTML = text;
            else p.innerText = text;
            terminalOutput.appendChild(p);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }

        function handleCommand(cmd) {
            printToTerminal(`root@rupesh:~# ${cmd}`);
            const args = cmd.trim().toLowerCase().split(' ');
            
            switch(args[0]) {
                case 'help':
                    printToTerminal('Available commands:');
                    printToTerminal('  <span class="text-paper bg-ink px-1">help</span>    - Show this message', true);
                    printToTerminal('  <span class="text-paper bg-ink px-1">whoami</span>  - Display user identity', true);
                    printToTerminal('  <span class="text-paper bg-ink px-1">skills</span>  - List primary technical skills', true);
                    printToTerminal('  <span class="text-paper bg-ink px-1">clear</span>   - Clear terminal output', true);
                    printToTerminal('  <span class="text-paper bg-ink px-1">exit</span>    - Close terminal session', true);
                    break;
                case 'whoami':
                    printToTerminal('Rupesh Bethapudi - AI/ML Engineer & Full Stack Developer');
                    break;
                case 'skills':
                    printToTerminal('Executing skill_matrix.sh...');
                    setTimeout(() => printToTerminal('=> Python, TensorFlow, React, Solidity, AWS, Docker'), 400);
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    break;
                case 'exit':
                    closeTerminal();
                    break;
                case '':
                    break;
                default:
                    printToTerminal(`bash: ${args[0]}: command not found`);
            }
        }

        function openTerminal() {
            if(terminalOverlay) {
                terminalOverlay.classList.remove('hidden');
                terminalOverlay.classList.add('flex');
                setTimeout(() => terminalInput.focus(), 100);
            }
        }

        function closeTerminal() {
            if(terminalOverlay) {
                terminalOverlay.classList.add('hidden');
                terminalOverlay.classList.remove('flex');
            }
        }

        if(terminalOverlay) {
            const toggleTerminal = () => {
                if(terminalOverlay.classList.contains('hidden')) {
                    openTerminal();
                } else {
                    closeTerminal();
                }
            };

            document.addEventListener('keydown', (e) => {
                if(e.key === '`' || e.key === '~') {
                    e.preventDefault();
                    toggleTerminal();
                }
            });

            closeTerminalBtn.addEventListener('click', closeTerminal);
            
            document.addEventListener('click', (e) => {
                if(e.target.closest('.terminal-trigger-btn')) {
                    toggleTerminal();
                }
            });

            terminalInput.addEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    handleCommand(terminalInput.value);
                    terminalInput.value = '';
                }
            });
        }