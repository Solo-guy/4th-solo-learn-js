    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const PLAYER_STORAGE_KEY = 'PLAYER'


        const player = $('.player')
        const cd = $('.cd')

        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio')
        const playBtn = $('.btn-toggle-play')
        const progress = $('#progress')
        const prevBtn = $('.btn-prev')
        const nextBtn = $('.btn-next')
        const randomBtn = $('.btn-random')
        const repeatBtn = $('.btn-repeat')
        const playlist = $('.playlist')

    const app = {
        currentIndex: 0,
        isplaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
                name: 'Late Night Talking',
                singer: 'Harry Styles',
                path: './assets/music/song1.mp3',
                image: './assets/img/song1.jpg'
            },
            {
                name: 'Time In A Bottle',
                singer: 'Jim Croce',
                path: './assets/music/song2.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'LẦN CUỐI',
                singer: 'Ngọt',
                path: './assets/music/song3.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'Mấy Khi',
                singer: 'Ngọt',
                path: './assets/music/song4.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'Hold On',
                singer: 'Chord Overstreet',
                path: './assets/music/song5.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'Escape ',
                singer: 'Rupert Holmes',
                path: './assets/music/song6.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'She Knows',
                singer: 'J. Cole',
                path: './assets/music/song7.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'edamame ',
                singer: 'bbno$ & Rich Brian',
                path: './assets/music/song8.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'Đó Chỉ Là Thành Phố Của Anh',
                singer: 'Lux x Prod New$oulZu',
                path: './assets/music/song9.mp3',
                image: './assets/img/themeimg.png'
            },
            {
                name: 'Take What You Want',
                singer: 'Post Malone ft. Ozzy Osbourne, Travis Scott',
                path: './assets/music/song10.mp3',
                image: './assets/img/themeimg.png'
            }
            
        ],
            setconfig: function(key, value) {
                this.config[key] = value
                localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
            },
         render: function() {
            const htmls = this.songs.map((song, index) => {
                return `  
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index =" ${index}">
                    <div class="thumb"
                     style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div> 
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
            })
            playlist.innerHTML = htmls.join('')
          
        },  
        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex]
                }
            })
        },
        handleEvents: function() {
            const _this = this
            const cdWidth = cd.offsetWidth

            //Xử lí CD quay và dừng
            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)'}
            ], {
                duration: 10000, //10 giây
                iterations: Infinity
            })
            cdThumbAnimate.pause()

            // Xử lý phóng to thu nhỏ CD
            document.onscroll = function() {
               const scrollTop = window.scrollY || document.documentElement.scrollTop
               const newCdWidth = cdWidth - scrollTop

               cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
               cd.style.opacity = newCdWidth / cdWidth
            }

            //Xử lý khi ấn play
            playBtn.onclick = function() {
                if (_this.isplaying) {  
                    audio.pause()
                }else {
                    audio.play()
                }            
            } 

            // khi bài hát được play
            audio.onplay = function() {
                _this.isplaying = true
                player.classList.add('playing')
                cdThumbAnimate.play()
            }   

             // khi bài hát bị pause
             audio.onpause = function() {
                _this.isplaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            } 

            //Khi tua bài hát
            audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent
                }  
            } 

            // Xử lý khi tua nhạc
            progress.onchange = function(e) {
                const seekTime = audio.duration / 100 * e.target.value
                audio.currentTime = seekTime
            }

            //khi next bài 
            nextBtn.onclick = function() {
                if (_this.isRandom) {
                    _this.playRandomSong()
                }else {
                    _this.nextSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

              //khi prev bài 
              prevBtn.onclick = function() {
                if (_this.isRandom){
                    _this.playRandomSong()
                }else {
                    _this.prevSong()
                }
                audio.play()
                _this.render()
                _this.scrollToActiveSong()
            }

            // khi ấn/tắt random
            randomBtn.onclick = function(e) {
                _this.isRandom = !_this.isRandom
                _this.setconfig('isRandom', _this.isRandom)
                randomBtn.classList.toggle('active', _this.isRandom)
            }  

            //Xử lý lặp lại nhạc
            repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat
                _this.setconfig('isRepeat', _this.isRepeat)
                repeatBtn.classList.toggle('active', _this.isRepeat)
            }

            //Xử lý next song khi audio ended
            audio.onended = function() {
                if (_this.isRepeat){
                    audio.play()
                }else {
                    nextBtn.click()
                }
            }

            //Lắng nghe hành vi ấn vào playlist
            playlist.onclick = function(e) {
                const songNode = e.target.closest('.song:not(.active)')

                if (songNode || e.target.closest('.option')) {
                    //Xử lý khi click vào bài hát
                    if (songNode) {
                        _this.currentIndex = Number(songNode.dataset.index)
                        _this.loadCurrentSong()
                        _this.render()
                        audio.play()
                    }

                    //Xử lí khi án vào song option
                     if (e.target.closest('.option')) {

                    }
                }
            }
        },
        scrollToActiveSong: function() {
            setTimeout(() => {
                $('.song.active').scrollIntoview({
                    behavior: 'smooth',
                    block: 'nearest',
                })
            },300)
        },
        loadCurrentSong: function() {
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
            audio.src = this.currentSong.path

        },
        loadConfig: function() {
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat
        },
        nextSong: function() {
            this.currentIndex++
            if(this.currentIndex >= this.songs.length){
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },
        prevSong: function() {
            this.currentIndex--
            if(this.currentIndex < 0){
                this.currentIndex = this.songs.length -1 
            }
            this.loadCurrentSong()
        },
        playRandomSong: function() {
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * app.songs.length)
            }while (newIndex === this.currentIndex)

            this.currentIndex = newIndex
            this.loadCurrentSong()
        },

        start: function() {
            // Gán cấu hình từ config vào ứng dụng
            this.loadConfig()

            // định nghĩa các thuộc tính cho object
            this.defineProperties()

            // lắng nghe / xử lí các sự kiện (Doom events)
            this.handleEvents()

            //tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong()

            // render playlist
            this.render()

            // Hiện thị trang thái ban đầu của btn repeat and random
            randomBtn.classList.toggle('active', _this.isRandom)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
    }

    app.start()
