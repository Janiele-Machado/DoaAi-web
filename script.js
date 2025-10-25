// ==================== ESTADO GLOBAL ====================
const AppState = {
    currentScreen: 'splash',
    isLoggedIn: false,
    currentUser: null,
    selectedItemId: null,
    selectedCategory: 'all',
    searchQuery: ''
};

// ==================== DADOS SIMULADOS ====================
const mockItems = {
    '1': {
        title: 'Sofá 3 Lugares',
        description: 'Sofá em bom estado, cor cinza, pouco uso. Possui estrutura firme e tecido bem conservado.',
        category: 'Móveis',
        location: 'São Paulo, SP',
        date: '2 dias atrás',
        donor: 'Maria Silva',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'
    },
    '2': {
        title: 'Notebook Dell i5',
        description: 'Notebook funcionando perfeitamente, apenas com algumas marcas de uso. Ideal para estudos e trabalho.',
        category: 'Eletrônicos',
        location: 'Rio de Janeiro, RJ',
        date: '1 dia atrás',
        donor: 'João Santos',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    },
    '3': {
        title: 'Roupas Infantis',
        description: 'Lote com 15 peças de roupas infantis tamanho 4-6 anos em ótimo estado.',
        category: 'Vestuário',
        location: 'Belo Horizonte, MG',
        date: '3 dias atrás',
        donor: 'Ana Costa',
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500'
    },
    '4': {
        title: 'Mesa de Jantar',
        description: 'Mesa de jantar 6 lugares, madeira maciça. Muito bem conservada.',
        category: 'Móveis',
        location: 'Curitiba, PR',
        date: '5 dias atrás',
        donor: 'Carlos Oliveira',
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500'
    },
    '5': {
        title: 'Furadeira Elétrica',
        description: 'Furadeira em perfeito estado com maleta e acessórios inclusos.',
        category: 'Ferramentas',
        location: 'Porto Alegre, RS',
        date: '1 semana atrás',
        donor: 'Pedro Lima',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500'
    },
    '6': {
        title: 'Jogo de Panelas',
        description: 'Conjunto de panelas antiaderentes, 5 peças em ótimo estado.',
        category: 'Utensílios',
        location: 'Salvador, BA',
        date: '4 dias atrás',
        donor: 'Beatriz Souza',
        image: 'https://images.unsplash.com/photo-1584990347449-39b4aa16f730?w=500'
    },
    '7': {
        title: 'Bicicleta Caloi',
        description: 'Bicicleta aro 26, ótimo estado de conservação. Freios e marchas funcionando perfeitamente.',
        category: 'Outros',
        location: 'Fortaleza, CE',
        date: '2 dias atrás',
        donor: 'Rafael Martins',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500'
    },
    '8': {
        title: 'Tablet Samsung',
        description: 'Tablet 10 polegadas, funcionando perfeitamente. Acompanha carregador.',
        category: 'Eletrônicos',
        location: 'Brasília, DF',
        date: '6 dias atrás',
        donor: 'Fernanda Alves',
        image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
    }
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

function filterItems() {
    const searchQuery = AppState.searchQuery.toLowerCase();
    const category = AppState.selectedCategory;
    
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
    
    // Login form
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
    
    // Register form
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
    
    // Donate form
    const donateForm = document.getElementById('donate-form');
    if (donateForm) {
        donateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Doação publicada com sucesso!');
            navigateTo('home');
        });
    }
    
    // File upload
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
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            filterItems();
        });
    }
    
    // Category filters
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            AppState.selectedCategory = card.getAttribute('data-category');
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
    
    // Logout button
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
