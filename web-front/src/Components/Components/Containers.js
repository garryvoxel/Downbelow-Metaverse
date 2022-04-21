import React from 'react';
import styled from 'styled-components';

const ContainerColumnsStyle = styled.div`
    width:100%;
    margin-top: ${props => props.marginTop};
    display:grid;
    grid-template-columns:repeat(${props => props.columns}, 1fr);
    grid-column-gap:64px;
    align-items: ${props => props.align};

    @media (max-width: 1100px) {
        grid-template-columns:1fr;
        grid-template-rows: auto 1fr;
        align-items:center;
        grid-row-gap:64px;
    }
`

export function ContainerColumns (props) {
    return <ContainerColumnsStyle columns={props.columns} marginTop={props.marginTop} align={props.align}>
       {props.children}
    </ContainerColumnsStyle>
}

const ContainerColumnsCenterStyle = styled.div`
    width:100%;
    margin-top: ${props => props.marginTop};
    display:grid;
    grid-template-columns:repeat(${props => props.columns}, 1fr);
    grid-column-gap:64px;
    align-items:center;
    justify-items:center;

    @media (max-width: 1100px) {
        grid-template-columns:1fr;
        grid-template-rows: auto 1fr;
        align-items:center;
        grid-row-gap:64px;
    }
`

export function ContainerColumnsCenter (props) {
    return <ContainerColumnsCenterStyle columns={props.columns} marginTop={props.marginTop}>
       {props.children}
    </ContainerColumnsCenterStyle>
}

const ContainerCloseGridStyle = styled.div`
    width:100%;
    margin-top: ${props => props.marginTop};
    display:grid;
    grid-template-columns:repeat(${props => props.columns}, 1fr);
    grid-column-gap:0px;
    justify-items:center;

    @media (max-width: 990px) {
        grid-template-columns:1fr;
        align-items:center;
    }
`

export function ContainerCloseGrid (props) {
    return <ContainerCloseGridStyle columns={props.columns} marginTop={props.marginTop}>
       {props.children}
    </ContainerCloseGridStyle>
}

const ContainerInlineFlexwrapStyle = styled.div`
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-items:center;
    flex-wrap:wrap;
    margin-top:${props => props.marginTop}
`

export function ContainerInlineFlexwrap (props) {
    return <ContainerInlineFlexwrapStyle marginTop={props.marginTop}>
       {props.children}
    </ContainerInlineFlexwrapStyle>
}

const ContainerCenterStyle = styled.div`
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    margin-top:${props => props.marginTop};

    & img{
        margin-right:${props => props.marginRight};
    }

`

export function ContainerCenter (props) {
    return <ContainerCenterStyle marginTop={props.marginTop} marginRight={props.marginRight}>
       {props.children}
    </ContainerCenterStyle>
}

const ContainerResponsiveGridStyle = styled.div`
    width:100%;
    display:grid;
    grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
    grid-column-gap:20px;
    grid-row-gap:20px;
    margin-top:${props => props.marginTop};
    & img{
        width:100%;
        height:100%;
    }

    @media (max-width: 612px) {
        grid-template-columns: repeat( auto-fit, minmax(100px, 1fr) );
    }  
`

const CustomSizedGridStyle = styled.div`
    display: grid;
    grid-template-columns:repeat(${props => props.columns}, 1fr);
    grid-gap: ${props => props.gap};
`

export function CustomSizedGrid (props) {
    return <CustomSizedGridStyle columns={props.columns} gap={props.gap}>
        {props.children}
    </CustomSizedGridStyle>
}

export function ContainerResponsiveGrid (props) {
    return <ContainerResponsiveGridStyle marginTop={props.marginTop}>
       {props.children}
    </ContainerResponsiveGridStyle>
}

const ContainerRelativeCenterStyle = styled.div`
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    width:${props => props.width};
`

export function ContainerRelativeCenter (props){
    return <ContainerRelativeCenterStyle width={props.width}>
       {props.children}
    </ContainerRelativeCenterStyle>
}

const CoverStyle = styled.section`
    width:100%;
    background-color:${props => props.color};
    height:${props => props.height};
    position:relative;
`

export function Cover (props) {
    return <CoverStyle color={props.color} height={props.height}>
        {props.children}
    </CoverStyle>
}

const ImageTitledContainerStyle = styled.section`
    width:100%;
    background-image:url(${props => props.src});
    padding: 64px ${props => props.theme.containers.desktop.half};
    display:flex;
    flex-direction:column;
    background-size: cover;
    align-items:center;
`

export function ImageTitledContainer (props) {
    return <ImageTitledContainerStyle src={props.src}>
        {props.children}
    </ImageTitledContainerStyle>
}

const GradientContainerStyle = styled.section`
    width:100%;

    background-image: linear-gradient(to bottom, 
    ${props => props.theme.colors.containers.primary}, 
    ${props => props.theme.colors.containers.secondary});

    padding: 64px ${props => props.theme.containers.desktop.half};
    margin-top: ${props => props.marginTop};
    display:flex;
    flex-direction:column;
    align-items:center;
`

export function GradientContainer (props) {
    return <GradientContainerStyle variant={props.variant} marginTop={props.marginTop}>
        {props.children}
    </GradientContainerStyle>
}

const BasicContainerStyle = styled.section`
    width:100%;

    background-color:${props => props.variant === 'primary'?
    props.theme.colors.containers.primary :
    props => props.variant === 'secondary'?
    props.theme.colors.containers.secondary :
    props.theme.colors.containers.white};

    padding: 64px ${props => props.theme.containers.desktop.half};
    margin-top: ${props => props.marginTop};
    display:flex;
    flex-direction:column;
    align-items:center;
`

export function BasicContainer (props) {
    return <BasicContainerStyle id={props.id} variant={props.variant} marginTop={props.marginTop}>
        {props.children}
    </BasicContainerStyle>
}

const FlexBetweenColumnStyle = styled.div`
    display: flex;
    flex-direction: ${props => props.direction};
    justify-content: space-between;
`

export function FlexBetweenColumn (props) {
    return <FlexBetweenColumnStyle direction={props.direction}>
        {props.children}
    </FlexBetweenColumnStyle>
}