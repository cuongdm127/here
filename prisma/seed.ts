import { prisma } from '@/lib/prisma';

async function main() {
  await prisma.message.createMany({
    data: [
      { nickname: 'Sunshine', content: 'Chúc bạn một ngày tràn đầy năng lượng!', emotion: 'happy' },
      { nickname: 'Dreamer', content: 'Gửi bạn một bông hoa tinh thần 🌸', emotion: 'warm' },
      { nickname: 'StarGazer', content: 'Hãy thở thật sâu và mỉm cười nhé 😊', emotion: 'calm' },
      { nickname: 'Heartbeat', content: 'Bạn tuyệt vời hơn bạn nghĩ rất nhiều!', emotion: 'encourage' },
      { nickname: 'Wildflower', content: 'Mỗi bước đi dù chậm cũng là tiến', emotion: 'hope' },
      { nickname: 'Wanderer', content: 'Đừng quên nghỉ ngơi khi cần nữa nhé', emotion: 'care' },
      { nickname: 'Moonlit', content: 'Gửi bạn một cái ôm ảo 🤗', emotion: 'support' },
      { nickname: 'Radiance', content: 'Mỗi ngày là một cơ hội mới', emotion: 'inspire' },
      { nickname: 'HopeKeeper', content: 'Hãy tin vào bản thân và tiếp tục cố gắng', emotion: 'motivate' },
      { nickname: 'SoulMate', content: 'Bạn không đơn độc trên hành trình này', emotion: 'comfort' },
      { nickname: 'Serenity', content: 'Mỉm cười là cách khiến tâm hồn nhẹ nhàng', emotion: 'joy' },
      { nickname: 'BraveHeart', content: 'Có thể hôm nay mệt, nhưng mai trời sẽ sáng', emotion: 'hope' },
      { nickname: 'SunnySide', content: 'Hãy lắng nghe bản thân và biết ơn những giây phút yên bình', emotion: 'peace' },
      { nickname: 'Firefly', content: 'Gửi bạn chút động lực để bước tiếp', emotion: 'encourage' },
      { nickname: 'Whisper', content: 'Bạn đang làm rất tốt rồi đó', emotion: 'proud' },
      { nickname: 'Daydream', content: 'Mọi trở ngại chỉ là thử thách tạm thời', emotion: 'strength' },
      { nickname: 'Evergreen', content: 'Gửi bạn chút bình yên giữa bộn bề', emotion: 'calm' },
      { nickname: 'CloudNine', content: 'Hãy tin rằng điều tốt đẹp đang đến gần', emotion: 'hope' },
      { nickname: 'FreeSpirit', content: 'Một ngày mới, một khởi đầu mới!', emotion: 'fresh' },
      { nickname: 'KindSoul', content: 'Cảm ơn bạn đã tồn tại và lan tỏa yêu thương', emotion: 'gratitude' }
    ],
  });
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
