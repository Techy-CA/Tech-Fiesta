import { CallToAction } from '@/components/home/CallToAction'
import { Disciplines } from '@/components/home/Disciplines'
import { Eligibility } from '@/components/home/Eligibility'
import { Faq } from '@/components/home/Faq'
import { Format } from '@/components/home/Format'
import { Hero } from '@/components/home/Hero'
import { Partners } from '@/components/home/Partners'
import { Prizes } from '@/components/home/Prizes'
import { Schedule } from '@/components/home/Schedule'
import { Ticker } from '@/components/home/Ticker'

const Home = () => (
  <>
    <Ticker />
    <Hero />
    <Disciplines />
    <Format />
    <Schedule />
    <Prizes />
    <Eligibility />
    <Partners />
    <Faq />
    <CallToAction />
  </>
)

export default Home
