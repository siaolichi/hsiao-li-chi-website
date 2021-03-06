import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {Transition} from 'react-transition-group';
import {TweenMax} from 'gsap/all';
import MaterialIcon from '@material/react-material-icon';

import * as works from '../assets/works.js';
import './ArtWorkPage.scss';
import PhotoModal from '../components/PhotoModal.js';

const startState = {autoAlpha: 0, y: -50};

const ArtWorkPage = ({match, show}) => {
    const [modal, setModal] = useState({show: false, imageSrc: '', index: 0});
    if (!match) return <Fragment />;
    const work = works.default.filter((work) => work.id === match.params.id)[0];

    const nextImage = () => {
        console.log(work.photos.length - 1);
        if (modal.index < work.photos.length - 1)
            setModal({
                ...modal,
                index: modal.index + 1,
                imageSrc: require(`../assets/images/${work.id}/${work.photos[modal.index + 1]}`),
            });
        else
            setModal({
                ...modal,
                index: 0,
                imageSrc: require(`../assets/images/${work.id}/${work.photos[0]}`),
            });
    };
    const lastImage = () => {
        if (modal.index > 0)
            setModal({
                ...modal,
                index: modal.index - 1,
                imageSrc: require(`../assets/images/${work.id}/${work.photos[modal.index - 1]}`),
            });
        else
            setModal({
                ...modal,
                index: work.photos.length - 1,
                imageSrc: require(`../assets/images/${work.id}/${work.photos[work.photos.length - 1]}`),
            });
    };

    return (
        <Transition
            unmountOnExit
            in={show}
            timeout={1000}
            onEnter={(node) => TweenMax.set(node, startState)}
            addEndListener={(node, done) => {
                TweenMax.to(node, 0.5, {
                    autoAlpha: show ? 1 : 0,
                    y: show ? 0 : 50,
                    onComplete: done,
                });
            }}
        >
            <div className='work-page'>
                <div style={{margin: '30px'}}>
                    <Link to='/art-works' className='back-button-container'>
                        <MaterialIcon icon='arrow_back' className='back-button' />
                        Back
                    </Link>
                </div>
                <div className='work-content'>
                    <h1 className='title'>{work.title}</h1>
                    <div className='year'>{work.year}</div>
                    {work.video && (
                        <div className='video-container'>
                            <iframe
                                src={work.video}
                                title={work.title}
                                className='video-frame'
                                frameBorder='0'
                                allow='autoplay; fullscreen'
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    <div className='images'>
                        {work.photos.map((photo, index) => (
                            <div
                                key={index}
                                style={{
                                    width: 'calc(33% - 10px)',
                                    height: '150px',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                    backgroundImage: 'url(' + require(`../assets/images/${work.id}/${photo}`) + ')',
                                }}
                                onClick={() => {
                                    setModal({
                                        show: true,
                                        index,
                                        imageSrc: require(`../assets/images/${work.id}/${photo}`),
                                    });
                                }}
                            />
                        ))}
                    </div>
                    <div className='description' dangerouslySetInnerHTML={{__html: work.description}} />
                </div>
                <PhotoModal
                    image={modal.imageSrc}
                    nextImage={nextImage}
                    lastImage={lastImage}
                    show={modal.show}
                    removeModal={() => {
                        setModal({show: false, imageSrc: ''});
                    }}
                />
            </div>
        </Transition>
    );
};

export default ArtWorkPage;
