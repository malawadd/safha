import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ConnectWallet from "../components/ConnectWallet";

export default function Home() {
  return (
   <div>
    <ConnectWallet />
   </div>
  )
}
