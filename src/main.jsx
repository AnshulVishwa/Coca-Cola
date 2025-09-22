import { createRoot } from 'react-dom/client'
import React, { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import gsap from "gsap"
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import "./index.css"

gsap.registerPlugin(ScrollTrigger)

function Model({can, prev , setPrev}) {
  const { scene } = useGLTF(can)
  const ref = useRef()
  
  // Center pivot
  useEffect(() => {
    const box = new Box3().setFromObject(scene)
    const center = new Vector3()
    box.getCenter(center)
    scene.position.sub(center)
  }, [scene])
  
  // Animations
  useEffect(() => {
    if (ref.current) {
      if( prev != can ){
        gsap.to("#root" , {background : `#212${Math.floor(Math.random())*10+100}`})
        setPrev(can)
      }
      // Infinite rotation
      gsap.to(ref.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "linear"
      })

      // Scale & tilt on scroll
      gsap.to(ref.current.scale, {
        x: 0.5,
        y: 0.5,
        z: 0.5,
        scrollTrigger: {
          trigger: "#root",
          scrub: 1,
          start: "0%"
        }
      })

      gsap.to(ref.current.rotation, {
        z: 1,
        scrollTrigger: {
          trigger: "#root",
          scrub: 1,
          start: "10%"
        }
      })
    }
  }, [])

  return (
    <group ref={ref}>
      <primitive object={scene} scale={(can == "/french_coke_light_can.glb") ? 0.5 : 10} />
    </group>
  )
}

function App() {
  const containerRef = useRef()
  const [can , setCan] = useState("/coca-coka.glb") 
  const [prevCan , setPrevCan] = useState("/coca-coka.glb")
  useEffect( () => {
    if(containerRef.current){

      gsap.to( containerRef.current , {
        y : "130vh",
        x:"-70%",
        scrollTrigger : {
          trigger : "#root",
          start : "top",
          scrub : 1
        }
      } )
    }
  } , [] )
  return (
    <>
    <div className="upperDiv">
      <h1>Coca<pre>   </pre>Cola</h1>
      <div  style={{position:"absolute",zIndex:"5",top:"5%"}}>
        <button class="buttons b1" onClick={() => {setPrevCan(can); setCan("/coca-coka.glb")}}>Bottle1</button>
        <button class="buttons b2" onClick={() => {setPrevCan(can); setCan("/cola_can.glb")}}>Bottle2</button>
        <button class="buttons b3" onClick={() => {setPrevCan(can); setCan("/french_coke_light_can.glb")}}>Bottle3</button>
      </div>
      <div ref={containerRef} style={{ height: "500px", width: "50%" }}>
        <Canvas style={{height:"100%",width:"100%",transform:"translate(0,0)"}} camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <directionalLight intensity={0.5} position={[5, 5, 5]} />
          <pointLight intensity={1} position={[0,0,5]} />
          <Suspense fallback={null}>
            <Model can={can} prev={prevCan} setPrev={setPrevCan} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>
    </div>
      <div className="bottomDivDev flex">
        <h2>Why Choose Coca Cola</h2>
        <h3>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Inventore est beatae deleniti quia, ratione cumque expedita enim perferendis. Ex animi rerum sequi eum voluptas officia placeat dignissimos error doloribus cumque!
        Quasi volrror similique maiores ipsa. Sunt, beuae quasi sint odit nulla aliquid tempore sequi eius ea aliquam. Eveniet?
        Nulla minima, rerum dolore quasi unde sunt voluptate, dolor aspernatur architecto, qui id. Consequatur sapiente cum harum rem modi, a at eaque aspernatur non dolorum natus, ullam ratione velit tenetur.
        Vero maxime minima repellat? Ex, quas fugit incidunt, facere nobis ducimus sit hic soluta ipsam unde placeat assumenda dolorem quaerat ab repellendus impedit officia voluptatum sequi in non quibusdam ad.</h3>
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
