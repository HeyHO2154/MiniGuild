export class LoginModal {
    constructor(onLogin) {
        this.onLogin = onLogin;
        this.element = document.getElementById('nicknameModal');
        this.setupModal();
    }

    setupModal() {
        const input = this.element.querySelector('#nicknameInput');
        const button = this.element.querySelector('#startButton');

        button.onclick = () => {
            const nickname = input.value.trim();
            if (nickname) {
                this.element.style.display = 'none';  // 모달 숨기기
                this.onLogin(nickname);
            }
        };
    }
} 