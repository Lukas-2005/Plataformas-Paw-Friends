document.addEventListener('DOMContentLoaded', () => {

    // ===== DATOS INICIALES ===== //
    const featuredPets = [
        {
            id: 1,
            name: "Max",
            type: "Perro",
            breed: "Labrador",
            age: "2 años",
            img: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            gender: "Macho",
            description: "Max es un labrador muy amigable y juguetón, ideal para familias con niños. Le encanta correr y jugar a la pelota en el parque.",
            albergueId: 1
        },
        {
            id: 2,
            name: "Luna",
            type: "Gato",
            breed: "Siamés",
            age: "1 año",
            img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            gender: "Hembra",
            description: "Luna es una gata curiosa y cariñosa. Disfruta de la tranquilidad del hogar y pasar las tardes acurrucada en su cama.",
            albergueId: 2
        },
        {
            id: 3,
            name: "Rocky",
            type: "Perro",
            breed: "Bulldog",
            age: "3 años",
            img: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            gender: "Macho",
            description: "Rocky es un bulldog con un corazón enorme. Aunque su apariencia es fuerte, es muy dócil y protector con los suyos.",
            albergueId: 1
        },
        {
            id: 4,
            name: "Simba",
            type: "Gato",
            breed: "Atigrado",
            age: "6 meses",
            img: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            gender: "Macho",
            description: "Simba es un pequeño atigrado lleno de energía. Le encanta explorar y jugar con todo lo que encuentra.",
            albergueId: 2
        }
    ];

    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        if (!notification) {
            const newNotification = document.createElement('div');
            newNotification.id = 'notification';
            newNotification.className = 'notification';
            document.body.appendChild(newNotification);
        }
        const currentNotification = document.getElementById('notification');
        currentNotification.textContent = message;
        currentNotification.className = `notification ${type}`;
        currentNotification.style.display = 'block';
        setTimeout(() => {
            currentNotification.style.animation = 'fade-out 0.5s forwards';
            setTimeout(() => {
                currentNotification.style.display = 'none';
            }, 500);
        }, 3000);
    }
    window.showNotification = showNotification;

    function handleAlbergueSubmission(e) {
        e.preventDefault();
        const nombre = document.getElementById('albergueNombre').value.trim();
        const direccion = document.getElementById('albergueDireccion').value.trim();
        const horario = document.getElementById('albergueHorario').value.trim();
        const logoFile = document.getElementById('albergueLogo').files[0];

        if (!nombre || !direccion) {
            showNotification('Por favor, completa los campos obligatorios: Nombre y Dirección.', 'error');
            return;
        }

        const nuevaSolicitud = {
            id: Date.now(),
            nombre,
            direccion,
            horario,
            logo: null,
            status: 'pending'
        };

        if (logoFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                nuevaSolicitud.logo = event.target.result;
                saveAlbergueRequest(nuevaSolicitud);
            };
            reader.readAsDataURL(logoFile);
        } else {
            saveAlbergueRequest(nuevaSolicitud);
        }
    }
    
    function saveAlbergueRequest(request) {
        const solicitudes = JSON.parse(localStorage.getItem('albergueSolicitudes')) || [];
        solicitudes.push(request);
        localStorage.setItem('albergueSolicitudes', JSON.stringify(solicitudes));
        showNotification('¡Solicitud enviada! Nos pondremos en contacto contigo pronto.', 'success');
        document.getElementById('albergueForm').reset();
    }

    function loadAdminAlbergueSolicitudes() {
        const albergueSolicitudesContainer = document.getElementById('albergueSolicitudesContainer');
        if (!albergueSolicitudesContainer) return;
        const solicitudes = JSON.parse(localStorage.getItem('albergueSolicitudes')) || [];
        albergueSolicitudesContainer.innerHTML = '';

        if (solicitudes.length === 0) {
            albergueSolicitudesContainer.innerHTML = '<p>No hay solicitudes de albergues pendientes.</p>';
            return;
        }
        solicitudes.forEach(solicitud => {
            const solicitudCard = document.createElement('div');
            solicitudCard.className = 'solicitud-card';
            solicitudCard.innerHTML = `
                <div class="solicitud-info">
                    ${solicitud.logo ? `<img src="${solicitud.logo}" alt="Logo de ${solicitud.nombre}">` : '<i class="fas fa-paw albergue-icon"></i>'}
                    <h3>${solicitud.nombre}</h3>
                    <p><strong>Dirección:</strong> ${solicitud.direccion}</p>
                    <p><strong>Horario:</strong> ${solicitud.horario || 'No especificado'}</p>
                </div>
                <div class="solicitud-actions">
                    <button class="btn-success" onclick="approveAlbergue(${solicitud.id})">✅ Aprobar</button>
                    <button class="btn-danger" onclick="rejectAlbergue(${solicitud.id})">❌ Rechazar</button>
                </div>
            `;
            albergueSolicitudesContainer.appendChild(solicitudCard);
        });
    }

    window.approveAlbergue = (id) => {
        let solicitudes = JSON.parse(localStorage.getItem('albergueSolicitudes')) || [];
        const solicitudIndex = solicitudes.findIndex(s => s.id === id);
        
        if (solicitudIndex !== -1) {
            const albergueAprobado = solicitudes.splice(solicitudIndex, 1)[0];
            albergueAprobado.status = 'approved';
            albergueAprobado.reviews = [];
            
            const alberguesAprobados = JSON.parse(localStorage.getItem('alberguesAprobados')) || [];
            alberguesAprobados.push(albergueAprobado);
            
            localStorage.setItem('albergueSolicitudes', JSON.stringify(solicitudes));
            localStorage.setItem('alberguesAprobados', JSON.stringify(alberguesAprobados));
            
            showNotification('Albergue aprobado correctamente.', 'success');
            loadAdminAlbergueSolicitudes();
        }
    };

    window.rejectAlbergue = (id) => {
        let solicitudes = JSON.parse(localStorage.getItem('albergueSolicitudes')) || [];
        solicitudes = solicitudes.filter(s => s.id !== id);
        localStorage.setItem('albergueSolicitudes', JSON.stringify(solicitudes));
        showNotification('Solicitud de albergue rechazada.', 'error');
        loadAdminAlbergueSolicitudes();
    };

    function loadAlbergues() {
        const alberguesContainer = document.getElementById('alberguesContainer');
        if (!alberguesContainer) return;
        const alberguesAprobados = JSON.parse(localStorage.getItem('alberguesAprobados')) || [];
        alberguesContainer.innerHTML = '';

        if (alberguesAprobados.length === 0) {
            alberguesContainer.innerHTML = '<p>No hay albergues registrados por el momento.</p>';
            return;
        }

        alberguesAprobados.forEach(albergue => {
            const albergueCard = document.createElement('div');
            albergueCard.className = 'albergue-card';
            albergueCard.innerHTML = `
                <div class="albergue-logo-container">
                    ${albergue.logo ? `<img src="${albergue.logo}" alt="Logo de ${albergue.nombre}">` : '<i class="fas fa-paw albergue-icon"></i>'}
                </div>
                <h3>${albergue.nombre}</h3>
                <p>📍 ${albergue.direccion}</p>
                <a href="albergue-profile.html?id=${albergue.id}" class="btn-primary">Ver Perfil</a>
            `;
            alberguesContainer.appendChild(albergueCard);
        });
    }

    function loadAlbergueProfile() {
        const urlParams = new URLSearchParams(window.location.search);
        const albergueId = urlParams.get('id');
        const alberguesAprobados = JSON.parse(localStorage.getItem('alberguesAprobados')) || [];
        const albergue = alberguesAprobados.find(a => a.id == albergueId);

        if (!albergue) {
            document.querySelector('.albergue-profile-container').innerHTML = '<p>Albergue no encontrado.</p>';
            return;
        }
        
        document.getElementById('profileNombre').textContent = albergue.nombre;
        document.getElementById('profileDireccion').textContent = `Dirección: ${albergue.direccion}`;
        document.getElementById('profileHorario').textContent = `Horario: ${albergue.horario || 'No especificado'}`;
        const profileLogo = document.getElementById('profileLogo');
        if (albergue.logo) {
            profileLogo.src = albergue.logo;
            profileLogo.style.display = 'block';
        } else {
            profileLogo.style.display = 'none';
        }
        loadPetsAndReviews(albergue);
    }
    
    function loadPetsAndReviews(albergue) {
        const petsGrid = document.getElementById('pets-grid');
        petsGrid.innerHTML = '';
        const petsDelAlbergue = featuredPets.filter(pet => pet.albergueId == albergue.id);

        if (petsDelAlbergue.length === 0) {
            petsGrid.innerHTML = '<p>Este albergue no tiene mascotas para adoptar en este momento.</p>';
        } else {
            petsDelAlbergue.forEach(pet => {
                const petCard = document.createElement('div');
                petCard.className = 'pet-card';
                petCard.innerHTML = `
                    <img src="${pet.img}" alt="${pet.name}" class="pet-image">
                    <div class="pet-info">
                        <h3>${pet.name}</h3>
                        <p><strong>Raza:</strong> ${pet.breed}</p>
                        <p><strong>Edad:</strong> ${pet.age}</p>
                        <a href="pet-profile.html?id=${pet.id}" class="btn-adopt">💖 Conóceme</a>
                    </div>
                `;
                petsGrid.appendChild(petCard);
            });
        }
        loadReviews(albergue);
        const reviewForm = document.getElementById('reviewForm');
        if(reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const rating = document.getElementById('rating').value;
                const reviewText = document.getElementById('reviewText').value;

                if (!rating || !reviewText) {
                    showNotification('Por favor, selecciona una calificación y escribe un comentario.', 'error');
                    return;
                }

                // Aquí solo mostramos la reseña temporalmente sin guardarla
                const newReview = {
                    userName: 'Usuario Anónimo', // Nombre genérico
                    rating: parseInt(rating),
                    comment: reviewText,
                    date: new Date().toLocaleDateString()
                };
                
                const reviewsContainer = document.getElementById('reviewsContainer');
                const reviewElement = document.createElement('div');
                reviewElement.className = 'review-card';
                reviewElement.innerHTML = `
                    <div class="review-header">
                        <h4>${newReview.userName}</h4>
                        <span class="review-date">${newReview.date}</span>
                    </div>
                    <div class="review-rating">${'⭐'.repeat(newReview.rating)}</div>
                    <p>${newReview.comment}</p>
                `;
                reviewsContainer.prepend(reviewElement); // Añade la reseña al principio
                showNotification('¡Reseña enviada con éxito!', 'success');
                reviewForm.reset();
            });
        }
    }
    
    function loadReviews(albergue) {
        const reviewsContainer = document.getElementById('reviewsContainer');
        if(!reviewsContainer) return;

        // Aquí se mostrarán reseñas predeterminadas, ya que no se guardan
        const defaultReviews = [
            { userName: 'Carlos A.', rating: 5, comment: 'Un lugar increíble para las mascotas. Muy bien cuidadas y el personal es muy amable.', date: '01/09/2023' },
            { userName: 'Laura G.', rating: 4, comment: 'Visité y me encantó. Adopté a mi perrito y fue una experiencia muy buena.', date: '15/08/2023' }
        ];

        reviewsContainer.innerHTML = '';
        defaultReviews.forEach(review => {
            const stars = '⭐'.repeat(review.rating);
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review-card';
            reviewElement.innerHTML = `
                <div class="review-header">
                    <h4>${review.userName}</h4>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-rating">${stars}</div>
                <p>${review.comment}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const users = {
                'admin@pawfriends.com': { name: 'Admin', email: 'admin@pawfriends.com', password: '123', role: 'admin' },
                'adopter@pawfriends.com': { name: 'Adopter', email: 'adopter@pawfriends.com', password: '123', role: 'adopter' },
                'proveedor@pawfriends.com': { name: 'Proveedor', email: 'proveedor@pawfriends.com', password: '01234', role: 'proveedor' }
            };

            if (users[email] && users[email].password === password) {
                const user = users[email];
                showNotification(`¡Bienvenido, ${user.name}!`, 'success');
                localStorage.setItem('currentUser', JSON.stringify(user));

                setTimeout(() => {
                    if (user.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (user.role === 'proveedor') {
                        window.location.href = 'proveedor-publicidad.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                showNotification('Email o contraseña incorrectos.', 'error');
            }
        });
    }
    
    function handleAppointmentSubmission(e) {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('currentUser'));

        if (!user) {
            showNotification('Debes iniciar sesión para agendar citas', 'error');
            return;
        }

        const petId = document.getElementById('petId').value;
        const date = document.getElementById('appointmentDate').value;
        const time = document.getElementById('appointmentTime')?.value;
        const notes = document.getElementById('appointmentNotes')?.value || '';

        if (!date || !petId) {
            showNotification('Por favor selecciona una mascota y una fecha', 'error');
            return;
        }

        const newAppointment = {
            id: Date.now(),
            petId: petId,
            userEmail: user.email,
            userName: user.name,
            date: date,
            time: time,
            notes: notes,
            status: 'pending'
        };
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        appointments.push(newAppointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));

        showNotification('¡Cita agendada correctamente!', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    function loadPetProfile() {
        const urlParams = new URLSearchParams(window.location.search);
        const petId = urlParams.get('id');
        const pet = featuredPets.find(p => p.id == petId);
        
        if (!pet) {
            showNotification('Mascota no encontrada.', 'error');
            return;
        }

        document.getElementById('petImage').src = pet.img;
        document.getElementById('petName').textContent = pet.name;
        document.getElementById('petBreed').textContent = `Raza: ${pet.breed}`;
        document.getElementById('petAge').textContent = `Edad: ${pet.age}`;
        document.getElementById('petGender').textContent = `Género: ${pet.gender}`;
        document.getElementById('petDescription').textContent = pet.description;
        document.getElementById('petId').value = pet.id;

        document.getElementById('appointmentForm')?.addEventListener('submit', handleAppointmentSubmission);
    }
    
    function loadAdminAppointments() {
        const container = document.getElementById('pendingAppointments');
        if (!container) return;
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const pendingAppointments = appointments.filter(a => a.status === 'pending');
        container.innerHTML = '';
        if (pendingAppointments.length === 0) {
            container.innerHTML = '<p class="no-appointments">No hay solicitudes de visita pendientes.</p>';
            return;
        }
        pendingAppointments.forEach(appointment => {
            const pet = featuredPets.find(p => p.id == appointment.petId);
            const appointmentCard = document.createElement('div');
            appointmentCard.className = 'appointment-card';
            appointmentCard.innerHTML = `
                <div class="pet-info">
                    <img src="${pet.img}" alt="${pet.name}">
                    <div>
                        <h3>${pet.name} (${pet.breed})</h3>
                        <p><strong>Usuario:</strong> ${appointment.userName}</p>
                        <p><strong>Fecha:</strong> ${appointment.date} - ${appointment.time}</p>
                        <p><strong>Mensaje:</strong> "${appointment.notes || 'No hay notas.'}"</p>
                    </div>
                </div>
                <div class="appointment-actions">
                    <button class="btn-success" onclick="manageAppointment(${appointment.id}, 'approved')">✅ Aprobar</button>
                    <button class="btn-danger" onclick="manageAppointment(${appointment.id}, 'rejected')">❌ Rechazar</button>
                </div>
            `;
            container.appendChild(appointmentCard);
        });
    }

    window.manageAppointment = (appointmentId, action) => {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const appointmentIndex = appointments.findIndex(a => a.id == appointmentId);
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = action;
            localStorage.setItem('appointments', JSON.stringify(appointments));
            showNotification(`Cita ${action === 'approved' ? 'aprobada' : 'rechazada'}.`, 'success');
            loadAdminAppointments();
        }
    };

    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'index.html' || currentPage === '') {
        document.getElementById('albergueForm')?.addEventListener('submit', handleAlbergueSubmission);
    } else if (currentPage === 'admin-dashboard.html') {
        loadAdminAlbergueSolicitudes();
        loadAdminAppointments();
    } else if (currentPage === 'albergues.html') {
        loadAlbergues();
    } else if (currentPage === 'albergue-profile.html') {
        loadAlbergueProfile();
    } else if (currentPage === 'pet-profile.html') {
        loadPetProfile();
    }
});