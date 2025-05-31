class Player {
    constructor(id, x, y, name) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.color = '#ff0000';
        this.speed = 5;  // 이동 속도 추가
    }

    // 모든 Player가 공통으로 가져야 할 메서드
    getPosition() {
        return { x: this.x, y: this.y };
    }

    // 하위 클래스에서 반드시 구현해야 할 메서드
    move(data) {
        // 새로운 위치로 업데이트
        if (data.x !== undefined && data.y !== undefined) {
            this.x = data.x;
            this.y = data.y;
        }
    }
}

module.exports = Player; 