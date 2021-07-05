const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'CK_PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumbnail')
const audio = $('#audio')
const progress = $('.progress')
const currentTime = $('.current-time')
const maxDuration = $('.max-duration')


const randomBtn = $('.btn-random')
const playBtn = $('.btn-tonggle-play')
const prevBtn = $('.btn-previous')
const nextBtn = $('.btn-next')
const repeatBtn = $('.btn-repeat')

const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    // playlist songs
    songs: [
        {
            name: "Một Ngày Không Xa Tôi Về Nơi Chốn Quê Thanh Bình",
            singer: "UNKNOWN",
            path: "./assets/audio/Avicii - THE NIGHT - Một Ngày Không Xa Tôi Về Nơi Chốn Quê Thanh Bình - Hot Tik Tok.mp3",
            image: "./assets/images/dong-que-viet-nam.jpg"
        },
        {
            name: "Remember Me",
            singer: "Sơn Tùng M-TP",
            path: "./assets/audio/Sơn Tùng MTP - Remember Me (SlimV 2017 Mix).mp3",
            image: "./assets/images/Remember me.jpg"
        },
        {
            name: "Sóng gió",
            singer: "Jack_K-ICM",
            path: "./assets/audio/Song Gio - Jack_ K-ICM.mp3",
            image: "./assets/images/Sóng gió.jpg"
        },
        {
            name: "Bạc phận",
            singer: "Jack_K-ICM",
            path: "./assets/audio/BẠC PHẬN - K-ICM ft. JACK - OFFICIAL MV.mp3",
            image: "./assets/images/Bạc phận.jpg"
        },
        {
            name: "Bài Này Chill Phết",
            singer: "Đen ft. MIN",
            path: "./assets/audio/Đen ft. MIN - Bài Này Chill Phết (M-V).mp3",
            image: "./assets/images/bài này chill phết.jpg"
        },
        {
            name: "Reality",
            singer: "Lost Frequencies",
            path: "./assets/audio/Reality - Lost Frequencies - Lyrics + Vietsub..mp3",
            image: "./assets/images/reality.jpg"
        },
        {
            name: "Bạch Nguyệt Quang Và Nốt Chu Sa",
            singer: "UNKNOWN",
            path: "./assets/audio/【白月光与朱砂痣 - Violin Cover by Zy Tang Bạch Nguyệt Quang Và Nốt Chu Sa (Remix)- Đại Tử không lời tiktok.mp3",
            image: "./assets/images/bạch nguyệt quang và nốt chu sa.jpg"
        },
        {
            name: "Windy Hill",
            singer: "UNKNOWN",
            path: "./assets/audio/羽肿 - Windy Hill (BGM).mp3",
            image: "./assets/images/windy hill.jpg"
        },
        {
            name: "Muộn rồi mà sao còn",
            singer: "Sơn Tùng M-TP",
            path: "./assets/audio/SƠN TÙNG M-TP - MUỘN RỒI MÀ SAO CÒN - OFFICIAL MUSIC VIDEO.mp3",
            image: "./assets/images/muộn rồi mà sao còn.jpg"
        },
        {
            name: "See You Again",
            singer: "Wiz Khalifa ft. Charlie Puth",
            path: "./assets/audio/Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack.mp3",
            image: "./assets/images/SeeYouAgain.png"
        },
        {
            name: "Monsters",
            singer: "Katie Sky",
            path: "./assets/audio/Monsters - Katie Sky (Lyrics + Vietsub) ♫.mp3",
            image: "./assets/images/monsters.jpg"
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumbnail" style="background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="singer">${song.singer}</p>
                    </div>
                    <div class="option">
                        <span class="material-icons-outlined"> more_horiz </span>
                    </div>
                </div>       
            `
        })

        playlist.innerHTML = htmls.join('')
    },

    // lưu bài hát đầu tiên vào currentSong
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    
    handlEvents: function() {
        const _this = this

        // xử lí CD quay / dừng khi phát nhạc
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)',
            }
        ], {
            duration: 10000,  // quay trong 10s
            iterations: Infinity   // vòng lặp: vô hạn
        })
        cdThumbAnimate.pause()  // mặc định là pause, không quay

        // xử lí khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            }
            else {
                audio.play()
            }    
        }

        // khi bài hát được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi bài hát bị pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi thì thanh ngang thay đổi và thời gian thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                // thanh progress thay đổi
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent

                // song timer thay đổi
                let currentMins = Math.floor(audio.currentTime / 60)
                let currentSecs = Math.floor(audio.currentTime - currentMins * 60)
                let durationMins = Math.floor(audio.duration / 60)
                let durationSecs = Math.floor(audio.duration - durationMins * 60)
                if(currentSecs < 10) {
                    currentSecs = "0" + currentSecs
                }
                if(durationSecs < 10) {
                    durationSecs = "0" + durationSecs
                }
                if(currentMins < 10) {
                    currentMins = "0" + currentMins
                }
                if(durationMins < 10) {
                    durationMins = "0" + durationMins
                }
                currentTime.innerHTML = currentMins + ":" + currentSecs
                maxDuration.innerHTML = durationMins + ":" + durationSecs
            }
            else {
                currentTime.innerHTML = "00:00"
                maxDuration.innerHTML = "00:00"
            }
        }

        // xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        // khi next bài hát
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }

            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // khi prev bài hát
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.prevSong()
            }
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // khi bật / tắt random bài hát
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)

            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // xử lí lặp lại 1 bài hát
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // xử lí next bài hát khi bài hát kết thúc
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()    // tự ấn click
            }
        }

        // lắng nghe click vào playlist
        playlist.onclick = function(e) {
            const songNode =  e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')

            if( songNode || songOption) {
                // xử lí khi click vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // xử lí khi click vào option
                if(songOption) {

                }
            }
        }
    },

    // load bài hát hiện tại
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    // load cấu hình hiện tại
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    // next sang bài tiếp theo
    nextSong: function() {
        this.currentIndex++
        // nếu lớn quá độ dài playlist thì quay về bài đầu tiên
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // prev lại bài trước
    prevSong: function() {
        this.currentIndex--
        // nếu nhỏ hơn 0 thì quay về bài cuối cùng
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // play với random song
    playRandomSong: function() {
        let newIndex 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex )

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // kéo bài hát hiện tại lên view
    scrollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth'
        })
    },

    start: function() {
        // gán cấu hình từ config vào app
        this.loadConfig()

        // định nghĩa thuộc tính cho object
        this.defineProperties()

        // xử lí các sự kiện
        this.handlEvents()

        // tải bài hát đầu tiên khi chạy app
        this.loadCurrentSong()

        // render playlist
        this.render()

        // hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    } 

}

app.start()

