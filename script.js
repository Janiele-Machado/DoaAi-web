// ==================== ESTADO GLOBAL ====================
const AppState = {
    currentScreen: 'splash',
    isLoggedIn: false,
    currentUser: null,
    selectedItemId: null,
    homeCategoryFilter: 'all',
    myDonationsStatusFilter: 'available', // 'available' ou 'donated' = "doado"
    searchQuery: ''
};

// -------------------- DADOS SIMULADOS nos CARDS ----------------------------
const mockItems = {
    '1': {
        title: 'Sofá 3 Lugares',
        description: 'Sofá em bom estado, cor cinza, pouco uso. Possui estrutura firme e tecido bem conservado.',
        category: 'Móveis',
        location: 'São Paulo, SP',
        date: '2 dias atrás',
        donor: 'Maria Silva',
        image: 'img/sofa.png',
        status: 'available'
    },
    '2': {
        title: 'Notebook Dell i5',
        description: 'Notebook funcionando perfeitamente, apenas com algumas marcas de uso. Ideal para estudos e trabalho.',
        category: 'Eletrônicos',
        location: 'Rio de Janeiro, RJ',
        date: '1 dia atrás',
        donor: 'João Santos',
        image: 'img/notebook.jfif',
        status: 'available'
    },
    '3': {
        title: 'Roupas Infantis',
        description: 'Lote com 15 peças de roupas infantis tamanho 4-6 anos em ótimo estado.',
        category: 'Vestuário',
        location: 'Belo Horizonte, MG',
        date: '3 dias atrás',
        donor: 'Ana Costa',
        image: 'img/roupas.jfif',
        status: 'available'
    },
    '4': {
        title: 'Mesa de Jantar',
        description: 'Mesa de jantar 6 lugares, madeira maciça. Muito bem conservada.',
        category: 'Móveis',
        location: 'Curitiba, PR',
        date: '5 dias atrás',
        donor: 'Carlos Oliveira',
        image: 'img/mesa.jfif',
        status: 'donated' // Exemplo de item já doado
    },
    '5': {
        title: 'Furadeira Elétrica',
        description: 'Furadeira em perfeito estado com maleta e acessórios inclusos.',
        category: 'Ferramentas',
        location: 'Porto Alegre, RS',
        date: '1 semana atrás',
        donor: 'Pedro Lima',
        image: 'img/furadeira.jfif',
        status: 'available'
    },
    '6': {
        title: 'Jogo de Panelas',
        description: 'Conjunto de panelas antiaderentes, 5 peças em ótimo estado.',
        category: 'Utensílios',
        location: 'Salvador, BA',
        date: '4 dias atrás',
        donor: 'Beatriz Souza',
        image: 'img/panelas.jpg',
        status: 'available'
    },
    '7': {
        title: 'Bicicleta Caloi',
        description: 'Bicicleta aro 26, ótimo estado de conservação. Freios e marchas funcionando perfeitamente.',
        category: 'Outros',
        location: 'Fortaleza, CE',
        date: '2 dias atrás',
        donor: 'Rafael Martins',
        image: 'img/bicicleta.jpg',
        status: 'available'
    },
    '8': {
        title: 'Tablet Samsung',
        description: 'Tablet 10 polegadas, funcionando perfeitamente. Acompanha carregador.',
        category: 'Eletrônicos',
        location: 'Brasília, DF',
        date: '6 dias atrás',
        donor: 'Fernanda Alves',
        image: 'img/tablet.jfif',
        status: 'available'
    }
};
const mockUserActivity = { // Simulação de atividades do usuário
    myDonations: ['4', '6'], // IDs dos itens que o usuário doou
    receivedItems: ['7'],    // IDs dos itens que o usuário recebeu
    favorites: ['1', '2', '8'] // IDs dos itens que o usuário favoritou
};

// ==================== FUNÇÕES AUXILIARES ====================
function showToast(message, type = 'success') { 
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-circle-check' : 
                 type === 'error' ? 'fa-circle-xmark' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function navigateTo(screen, itemId = null) {
    // Esconder todas as telas
    document.querySelectorAll('#app > div').forEach(div => {
        div.classList.add('hidden');
    });
    
    // Mostrar tela solicitada
    const screenElement = document.getElementById(`${screen}-screen`);
    if (screenElement) {
        screenElement.classList.remove('hidden');
        AppState.currentScreen = screen;
        
        if (itemId) {
            AppState.selectedItemId = itemId;
            loadItemDetail(itemId);
        }

        // Controlar visibilidade do footer
        const footer = document.querySelector('.site-footer');
        const screensWithFooter = ['login', 'home', 'register', 'recover', 'recover-code', 'reset-password'];

        if (footer) {
            footer.style.display = screensWithFooter.includes(screen) ? 'block' : 'none';
        }

        // Hack para centralizar o título do perfil
        if (screen === 'profile') {
            const backBtn = document.getElementById('profile-back-btn');
            const spacer = document.getElementById('header-right-spacer');
            // Garante que o spacer tenha a mesma largura do botão de voltar
            if (backBtn && spacer) spacer.style.width = `${backBtn.offsetWidth}px`;
        }

        // Carregar dados das telas de atividades
        if (screen === 'my-donations') {
            renderMyDonations();
        } else if (screen === 'received-items') {
            renderActivityList('receivedItems', 'received-items-grid', 'received-items-empty');
        } else if (screen === 'favorites') {
            renderActivityList('favorites', 'favorites-grid', 'favorites-empty');
        } else if (screen === 'edit-donation') {
            loadDonationForEdit(itemId);
        }

        // Rola para o topo se for a tela inicial
        if (screen === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }
}

function loadItemDetail(itemId) {
    const item = mockItems[itemId];
    if (!item) return;
    
    document.getElementById('detail-title').textContent = item.title;
    document.getElementById('detail-category').textContent = item.category;
    document.getElementById('detail-donor').textContent = item.donor;
    document.getElementById('detail-location').textContent = item.location;
    document.getElementById('detail-date').textContent = item.date;
    document.getElementById('detail-description').textContent = item.description;
    document.getElementById('detail-image').src = item.image;
    document.getElementById('detail-image').alt = item.title;
}

function loadDonationForEdit(itemId) {
    const item = mockItems[itemId];
    if (!item) return;

    document.getElementById('edit-title').value = item.title;
    document.getElementById('edit-category').value = item.category;
    document.getElementById('edit-description').value = item.description;

    const form = document.getElementById('edit-donation-form');
    // Remove o listener antigo para evitar múltiplos envios
    form.replaceWith(form.cloneNode(true)); 
    document.getElementById('edit-donation-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Atualiza os dados do item (simulação)
        mockItems[itemId].title = document.getElementById('edit-title').value;
        mockItems[itemId].category = document.getElementById('edit-category').value;
        mockItems[itemId].description = document.getElementById('edit-description').value;
        showToast('Anúncio atualizado com sucesso!');
        navigateTo('my-donations');
    });
}

function renderMyDonations() {
    const statusFilter = AppState.myDonationsStatusFilter;
    const filteredIds = mockUserActivity.myDonations.filter(id => mockItems[id].status === statusFilter);
    const emptyMessageText = statusFilter === 'available' 
        ? 'Você não tem doações em andamento.' 
        : 'Você ainda não concluiu nenhuma doação.';
    
    renderActivityList('myDonations', 'my-donations-grid', 'my-donations-empty', filteredIds, emptyMessageText);
}

function renderActivityList(activityType, gridId, emptyMessageId, itemIdsOverride = null, emptyMessageText = null) {
    const grid = document.getElementById(gridId);
    const emptyMessage = document.getElementById(emptyMessageId);
    const itemIds = itemIdsOverride || mockUserActivity[activityType];

    grid.innerHTML = ''; // Limpa a grade antes de renderizar

    if (itemIds && itemIds.length > 0) {
        emptyMessage.classList.add('hidden');
        grid.classList.remove('hidden');
        itemIds.forEach(id => {
            const item = mockItems[id];
            if (item) {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.setAttribute('data-id', id);
                card.setAttribute('data-category', item.category);

                let actionsHTML = '';
                let donatedOverlay = '';

                if (activityType === 'myDonations') {
                    if (item.status === 'donated') {
                        card.classList.add('donated');
                        donatedOverlay = `<div class="donated-overlay"><i class="fas fa-check-circle"></i> Concluído</div>`;
                    } else {
                        actionsHTML = `
                            <div class="item-card-actions">
                                <button class="btn btn-secondary edit-btn" data-id="${id}">Editar</button>
                                <button class="btn btn-primary mark-donated-btn" data-id="${id}">Marcar como Doado</button>
                                <button class="btn btn-danger delete-btn" data-id="${id}"><i class="fas fa-trash"></i> Excluir</button>
                            </div>
                        `;
                    }
                }
                // Conteúdo do card
                card.innerHTML = `
                    ${donatedOverlay}
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-content">
                        <h4 class="item-title">${item.title}</h4>
                        <p class="item-description">${item.description.substring(0, 60)}...</p>
                        <div class="item-meta">
                            <span><i class="fas fa-map-marker-alt"></i> ${item.location}</span>
                            <span class="item-category">${item.category}</span>
                        </div>
                    </div>
                    ${actionsHTML}
                `;
                // Adiciona evento de clique no card, exceto nos botões
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        navigateTo('item-detail', id);
                    }
                });
                grid.appendChild(card);
            }
        });

        // Adiciona listeners para os novos botões
        grid.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.currentTarget.getAttribute('data-id');
                navigateTo('edit-donation', itemId);
            });
        });

        grid.querySelectorAll('.mark-donated-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.currentTarget.getAttribute('data-id');
                openMarkAsDonatedModal(itemId);
            });
        });

        grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.currentTarget.getAttribute('data-id');
                openDeleteItemModal(itemId);
            });
        });
    } else {
        // Mostra a mensagem de estado vazio se não houver itens
        grid.classList.add('hidden');
        if (emptyMessageText) emptyMessage.textContent = emptyMessageText;
        emptyMessage.classList.remove('hidden');
    }
}

function filterItems() {
    const searchQuery = AppState.searchQuery.toLowerCase();
    const category = AppState.homeCategoryFilter;
    
    document.querySelectorAll('.item-card').forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const title = card.querySelector('.item-title').textContent.toLowerCase();
        const description = card.querySelector('.item-description').textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchQuery) || description.includes(searchQuery);
        const matchesCategory = category === 'all' || cardCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const message = input.value.trim();
    
    if (message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        
        const now = new Date();
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div>${message}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        input.value = '';
        
        // Auto scroll to bottom
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }
}

function logout() {
    AppState.isLoggedIn = false;
    AppState.currentUser = null;
    navigateTo('login');
    showToast('Logout realizado com sucesso!');
}

function openMarkAsDonatedModal(itemId) {
    const title = 'Confirmar Doação';
    const content = `
        <p>Que ótima notícia! Para finalizar, informe quem recebeu este item.</p>
        <form id="mark-donated-form">
            <div class="form-group">
                <label for="recipient-name">Nome do Receptor</label>
                <input type="text" id="recipient-name" placeholder="Nome de quem recebeu" required>
            </div>
            <div class="form-group" style="margin-top: 24px;">
                <button type="submit" class="btn btn-primary">Concluir Doação</button>
            </div>
        </form>
    `;
    openModal(title, content);

    document.getElementById('mark-donated-form').addEventListener('submit', (e) => {
        e.preventDefault();
        mockItems[itemId].status = 'donated';
        closeModal();
        showToast('Doação concluída com sucesso!');
        // Re-renderiza a lista para mostrar o status atualizado
        renderMyDonations();
    });
}

function openDeleteItemModal(itemId) {
    const item = mockItems[itemId];
    const title = 'Excluir Anúncio';
    const content = `
        <p>Tem certeza que deseja excluir este anúncio?</p>
        <p><strong>${item.title}</strong></p>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 16px;">Esta ação não pode ser desfeita.</p>
        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button type="button" id="cancel-delete-btn" class="btn btn-secondary" style="flex: 1;">Cancelar</button>
            <button type="button" id="confirm-delete-btn" class="btn btn-danger" style="flex: 1;">Excluir</button>
        </div>
    `;
    openModal(title, content);

    document.getElementById('cancel-delete-btn').addEventListener('click', closeModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        // Remove o item do mockItems
        delete mockItems[itemId];
        // Remove o item da lista de doações do usuário
        const index = mockUserActivity.myDonations.indexOf(itemId);
        if (index > -1) {
            mockUserActivity.myDonations.splice(index, 1);
        }
        closeModal();
        showToast('Anúncio excluído com sucesso!');
        // Re-renderiza a lista
        renderMyDonations();
    });
}

function openModal(title, content) {
    const modal = document.getElementById('generic-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.getElementById('generic-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

const modalContent = {
    about: `
        <h4>O que é o DoaAí?</h4>
        <p>O DoaAí é uma aplicação desenvolvida com o intuito de simplificar e organizar o processo de doação, criando um ambiente seguro, transparente e acessível para doadores e receptores.</p>
        <p>Nossa missão é conectar, de forma direta e estruturada, pessoas dispostas a doar itens em bom estado com famílias que necessitam desses recursos, combatendo o desperdício e promovendo a solidariedade.</p>
    `,
    terms: `
        <h4>1. Aceitação dos Termos</h4>
        <p>Ao usar o DoaAí, você concorda com estes Termos de Uso. Se não concordar, não utilize a plataforma.</p>
        <h4>2. Responsabilidade</h4>
        <p>O DoaAí é uma plataforma de intermediação. Não nos responsabilizamos pela qualidade, segurança ou legalidade dos itens doados, nem pela veracidade das informações dos usuários. Toda a negociação, entrega e retirada é de responsabilidade exclusiva dos usuários envolvidos.</p>
        <h4>3. Conduta do Usuário</h4>
        <p>É proibido solicitar pagamento por itens doados, usar a plataforma para fins ilegais ou publicar conteúdo ofensivo. Contas que violarem estas regras serão suspensas.</p>
    `,
    notifications: `
        <div class="setting-item">
            <span>Novas mensagens no chat</span>
            <label class="switch"><input type="checkbox" checked> <span class="slider"></span></label>
        </div>
        <div class="setting-item">
            <span>Interesse em seus itens</span>
            <label class="switch"><input type="checkbox" checked> <span class="slider"></span></label>
        </div>
        <div class="setting-item">
            <span>Novidades da plataforma</span>
            <label class="switch"><input type="checkbox"> <span class="slider"></span></label>
        </div>
    `,
    privacy: `
        <div class="setting-item">
            <span>Tornar meu perfil privado</span>
            <label class="switch"><input type="checkbox"> <span class="slider"></span></label>
        </div>
    `
};

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('[data-navigate]').forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const screen = element.getAttribute('data-navigate');
            navigateTo(screen);
        });
    });
    
    // formulario de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            
            AppState.isLoggedIn = true;
            AppState.currentUser = { email, name: 'Usuário' };
            
            showToast('Login realizado com sucesso!');
            navigateTo('home');
        });
    }
    
    // formulario de cadastro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const name = document.getElementById('register-name').value;
            
            AppState.isLoggedIn = true;
            AppState.currentUser = { email, name };
            
            showToast('Conta criada com sucesso!');
            navigateTo('home');
        });
    }
    
    // formulario de doação
    const donateForm = document.getElementById('donate-form');
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Doação publicada com sucesso!');
            navigateTo('home');
        });
    }
    
    // File upload (subindo arquivos)
    const fileUpload = document.getElementById('file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('change', (e) => {
            const files = e.target.files;
            const previewContainer = document.getElementById('preview-container');
            previewContainer.innerHTML = '';
            
            for (let file of files) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Search input (filtro de busca)
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            filterItems();
        });
    }
    
    // Category filters (filtro por categoria)
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.homeCategoryFilter = card.getAttribute('data-category');
            filterItems();
        });
    });
    
    // Item cards 
    document.querySelectorAll('.item-card').forEach(card => {
        card.addEventListener('click', () => {
            const itemId = card.getAttribute('data-id');
            navigateTo('item-detail', itemId);
        });
    });
    
    // Abas de Minhas Doações
    document.querySelectorAll('#my-donations-filter .tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('#my-donations-filter .tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const status = button.getAttribute('data-status');
            AppState.myDonationsStatusFilter = status;
            renderMyDonations();
        });
    });

    // Chat items
    document.querySelectorAll('.chat-list-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.chat-list-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
    
    // Message send button 
    const sendBtn = document.getElementById('send-message-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Message input enter key
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Contact button
    const contactBtn = document.getElementById('contact-btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            showToast('Mensagem enviada! Aguarde resposta do doador.');
            navigateTo('chat');
        });
    }
    
    // Logout button (butão de sair)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Recuperação de senha - passo 1: enviar código
    const recoverForm = document.getElementById('recover-form');
    if (recoverForm) {
        recoverForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const contact = document.getElementById('recover-contact').value.trim();
            if (!contact) return showToast('Informe email ou telefone para continuar', 'error');

            // gerar código de 6 dígitos simulado
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            AppState.recoveryCode = code;
            AppState.recoveryContact = contact;

            console.log('Código de recuperação (simulado):', code); // para desenvolvimento
            showToast('Código enviado para ' + contact + ' (simulado)');

            // navegar para a tela de verificação de código
            navigateTo('recover-code');
        });
    }

    // Recuperação de senha - passo 2: verificar código
    const recoverCodeForm = document.getElementById('recover-code-form');
    if (recoverCodeForm) {
        recoverCodeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('recover-code').value.trim();
            if (!codeInput || !AppState.recoveryCode) return showToast('Informe o código enviado', 'error');

            if (codeInput.length === 6) {
                showToast('Código verificado com sucesso!');
                // navegar para redefinir senha
                navigateTo('reset-password');
            } else {
                showToast('Código inválido. Verifique e tente novamente.', 'error');
            }
        });
    }

    // Recuperação de senha - passo 3: redefinir senha
    const resetForm = document.getElementById('reset-password-form');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pass = document.getElementById('reset-password').value;
            const passConfirm = document.getElementById('reset-password-confirm').value;

            if (!pass || !passConfirm) return showToast('Preencha os campos de senha', 'error');
            if (pass.length < 6) return showToast('A senha deve ter ao menos 6 caracteres', 'error');
            if (pass !== passConfirm) return showToast('As senhas não coincidem', 'error');

            // Simular atualização de senha
            console.log('Senha redefinida para contato:', AppState.recoveryContact);
            showToast('Senha redefinida com sucesso! Faça login com a nova senha.');
            // limpar estado de recuperação
            delete AppState.recoveryCode;
            delete AppState.recoveryContact;

            navigateTo('login');
        });
    }

    // Botões do modal (Sobre e Termos)
    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
        aboutBtn.addEventListener('click', () => openModal('Sobre o DoaAí', modalContent.about));
    }

    const termsBtn = document.getElementById('terms-btn');
    if (termsBtn) {
        termsBtn.addEventListener('click', () => openModal('Termos de Uso', modalContent.terms));
    }

    // Botões do modal (Configurações)
    const notificationsBtn = document.getElementById('notifications-btn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => openModal('Notificações', modalContent.notifications));
    }

    const privacyBtn = document.getElementById('privacy-btn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', () => openModal('Privacidade', modalContent.privacy));
    }

    // Botão para abrir modal de alterar senha
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            const title = 'Alterar Senha';
            const content = `
                <form id="change-password-modal-form">
                    <div class="form-group">
                        <label>Senha Atual</label>
                        <input type="password" id="modal-current-password" placeholder="Sua senha atual" required>
                    </div>
                    <div class="form-group">
                        <label>Nova Senha</label>
                        <input type="password" id="modal-new-password" placeholder="Mínimo 6 caracteres" required>
                    </div>
                    <div class="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input type="password" id="modal-new-password-confirm" placeholder="Confirme a nova senha" required>
                    </div>
                    <div class="form-group" style="margin-top: 24px;">
                        <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                    </div>
                </form>
            `;
            openModal(title, content);

            document.getElementById('change-password-modal-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const newPass = document.getElementById('modal-new-password').value;
                const newPassConfirm = document.getElementById('modal-new-password-confirm').value;

                if (newPass.length < 6) return showToast('A nova senha deve ter no mínimo 6 caracteres.', 'error');
                if (newPass !== newPassConfirm) return showToast('As novas senhas não coincidem.', 'error');

                closeModal();
                showToast('Senha alterada com sucesso!');
            });
        });
    }

    // Ações de conta (Desativar/Excluir)
    function handleAccountAction(action) {
        const isDeletion = action === 'delete';
        const title = isDeletion ? 'Excluir Conta' : 'Desativar Conta';
        const message = isDeletion 
            ? 'Esta ação é irreversível. Todos os seus dados, doações e conversas serão permanentemente apagados.' 
            : 'Sua conta será desativada e seu perfil não será mais visível. Você poderá reativá-la fazendo login novamente.';

        const content = `
            <p>${message}</p>
            <p>Para confirmar, por favor, digite sua senha abaixo.</p>
            <form id="account-action-form">
                <div class="form-group">
                    <label for="action-password">Senha</label>
                    <input type="password" id="action-password" placeholder="Sua senha" required>
                </div>
                <div class="form-group" style="margin-top: 24px;">
                    <button type="submit" class="btn btn-primary">${title}</button>
                </div>
            </form>
        `;
        openModal(title, content);

        // Adiciona o listener para o formulário recém-criado
        const actionForm = document.getElementById('account-action-form');
        actionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('action-password').value;
            if (!password) {
                return showToast('Por favor, informe sua senha.', 'error');
            }
            // Simulação de sucesso
            closeModal();
            const successMessage = isDeletion ? 'Conta excluída com sucesso!' : 'Conta desativada com sucesso!';
            showToast(successMessage);
            setTimeout(logout, 500); // Atraso para o usuário ver o toast
        });
    }

    const deactivateBtn = document.getElementById('deactivate-account-btn');
    deactivateBtn?.addEventListener('click', () => handleAccountAction('deactivate'));

    const deleteBtn = document.getElementById('delete-account-btn');
    deleteBtn?.addEventListener('click', () => handleAccountAction('delete'));

    // Fechar modal
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    const modalOverlay = document.getElementById('generic-modal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && closeModal());
    }
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar splash screen
    navigateTo('splash');
    
    // Ir para login após 2 segundos
    setTimeout(() => {
        // Apenas navega se ainda estiver na splash screen, para não interromper o usuário
        if (AppState.currentScreen === 'splash') {
            navigateTo('login');
        }
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
});
