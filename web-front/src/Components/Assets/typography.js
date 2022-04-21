import React from 'react';
import styled from 'styled-components';

const MainTitleStyle = styled.h1`
    font-family:${props => props.theme.fonts.title}; 
    font-size:${props => props.theme.fonts.sizes.title};
`

export function MainTitle (props) {
    return <MainTitleStyle color={props.color}>
        {props.children}
    </MainTitleStyle>
}

const SecondSectionTitleStyle = styled.h2`
    font-family:${props => props.theme.fonts.title}, serif;
    font-size:${props => props.theme.fonts.sizes.secondtitle};

    color:${props => props.variant === 'primary'?
    props.theme.colors.primary :
    props => props.variant === 'secondary'?
    props.theme.colors.containers.white :
    props.theme.colors.secondary };

    margin-bottom:${props => props.theme.margins.textFull};

    @media (max-width: 612px) {
        text-align:center;
        font-size: 12vw;
    }
`

export function SecondSectionTitle (props) {
    return <SecondSectionTitleStyle variant={props.variant}>
        {props.children}
    </SecondSectionTitleStyle>
}

const SecondContentTitleStyle = styled.h2`
    font-family:${props => props.theme.fonts.title}, serif;
    font-size:${props => props.theme.fonts.sizes.secondtitle};
    
    color:${props => props.variant === 'primary'?
    props.theme.colors.primary :
    props => props.variant === 'secondary'?
    props.theme.colors.containers.white :
    props.theme.colors.secondary };

    margin-bottom:${props => props.theme.margins.textHalf};

    @media (max-width: 612px) {
        text-align:center;
        font-size: 12vw;
    }
`

export function SecondContentTitle (props) {
    return <SecondContentTitleStyle variant={props.variant}>
        {props.children}
    </SecondContentTitleStyle>
}

const SubTitleStyle = styled.h4`
    font-size:${props => props.theme.fonts.sizes.subtitle};
    color: ${props => props.theme.colors.containers.white};
    margin-bottom:${props => props.theme.margins.textThird};
`

const ThirdContentTitleStyle = styled.h4`
    font-family:${props => props.theme.fonts.title}, serif;
    font-size:${props => props.theme.fonts.sizes.thirdtitle};

    color:${props => props.variant === 'primary'?
    props.theme.colors.primary :
    props => props.variant === 'secondary'?
    props.theme.colors.containers.white :
    props.theme.colors.secondary };

    margin-bottom:${props => props.theme.margins.textHalf};

    @media (max-width: 612px) {
        text-align:center;
        font-size: 12vw;
    }
`

export function ThirdContentTitle (props) {
    return <ThirdContentTitleStyle variant={props.variant}>
        {props.children}
    </ThirdContentTitleStyle>
}

export function SubTitle (props) {
    return <SubTitleStyle>
        {props.children}
    </SubTitleStyle>
}

const FeatureTitleStyle = styled.h4`
    font-family:${props => props.theme.fonts.title};
    font-size:${props => props.theme.fonts.sizes.feature};
    color: ${props => props.theme.colors.fonts.featured};
    margin-bottom:${props => props.theme.margins.secondhalf};
};
`

export function FeatureTitle (props) {
    return <FeatureTitleStyle variant={props.variant}>
        {props.children}
    </FeatureTitleStyle>
}


const ParagraphTitleStyle = styled.h4`
    font-size:${props => props.theme.fonts.sizes.subtitle};
    font-family:${props => props.theme.fonts.title}, serif;
    color: ${props => props.theme.colors.containers.white};
    margin-bottom:${props => props.theme.margins.textThird};
`

export function ParagraphTitle(props) {
    return <ParagraphTitleStyle>
    {props.children}
    </ParagraphTitleStyle>
}

const ParagraphStyle = styled.p`
    font-size:${props => props.theme.fonts.sizes.paragraph};
    color: ${props => props.theme.colors.containers.white};
`

export function Paragraph(props) {
    return <ParagraphStyle>
    {props.children}
    </ParagraphStyle>
}

const ParagraphLargeStyle = styled.h4`
    font-size:${props => props.theme.fonts.sizes.secondtitle};
    font-family:${props => props.theme.fonts.title};
    color: ${props => props.theme.colors.primary};
`

export function ParagraphLarge(props) {
    return <ParagraphLargeStyle>
    {props.children}
    </ParagraphLargeStyle>
}

const CountinuosStyle = styled.p`
    font-family:${props => props.theme.fonts.title};
    font-size:${props => props.theme.fonts.sizes.paragraph};
    font-weigth:400;
    color: ${props => props.theme.colors.containers.white};
`

export function Countinuos(props) {
    return <CountinuosStyle>
    {props.children}
    </CountinuosStyle>
}

const ListItemStyle = styled.li`
    font-family:${props => props.theme.fonts.subtitle};
    font-size:${props => props.theme.fonts.sizes.paragraph};
    font-weigth:400;
    color: ${props => props.theme.colors.containers.white};

    &::marker{
        color:${props => props.color};
    }
`

export function ListItem(props) {
    return <ListItemStyle color={props.color}>
    {props.children}
    </ListItemStyle>
}

const SupportStyle = styled.p`
    font-size:${props => props.theme.fonts.sizes.paragraph};
    font-weigth:400;
    color: ${props => props.theme.colors.containers.white};
    text-align:center;
    margin-top: ${props => props.theme.margins.textThird};
`

export function Support(props) {
    return <SupportStyle>
    {props.children}
    </SupportStyle>
}

export function Featured(props) {
    return <p>
        {props.children}
    </p>
}

export function Label(props) {
    return <label>
        {props.children}
    </label>
}

const LinkStyle = styled.a`
    text-decoration:none;
    color: ${props => props.theme.colors.primary};
    &:hover{
        color: ${props => props.theme.colors.primaryHover};
        cursor:pointer;
    }
`

export function Link(props) {
    return <LinkStyle href={props.href} target={props.target}>
        {props.children}
    </LinkStyle>
}

const LinkFooterStyle = styled.a`
    text-decoration:none;
    color: ${props => props.theme.colors.secondary};
    &:hover{
        color: ${props => props.theme.colors.secondaryHover};
        text-decoration:underline;
        cursor:pointer;
    }
`

export function LinkFooter(props) {
    return <LinkFooterStyle href={props.href} target={props.target}>
        {props.children}
    </LinkFooterStyle>
}