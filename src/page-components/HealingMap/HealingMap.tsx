import { Col, DashboardCard, Div, Grid, Heading, Row, Section, Text } from '../../theme/components';
import { IClaimLocation, IGlobalDashboard } from '../../apis/types';
import { Map } from '../../components';
import Api from '../../apis/api';
import React, { useEffect, useState } from 'react';

type HealingMapProps = {
    data?: IGlobalDashboard;
    heading?: string;
    text?: string;
};

export const HealingMap = (props: HealingMapProps) => {
    const { heading, text } = props;
    const [claims, setClaims] = useState<IClaimLocation[] | undefined>();

    useEffect(() => {
        const getClaims = async () => {
            const claims = await Api.getAllClaimLocation();

            setClaims(claims);
        };

        getClaims();
    }, []);

    return (
        <Section pt={{ sm: 4, xs: 2 }} sBackground="backgroundLight">
            <Grid>
                <Row>
                    <Col xs={12}>
                        <Heading h2>{heading}</Heading>
                        <Text mt={0.5} small>
                            {text}
                        </Text>
                    </Col>
                </Row>
                <Row mt={0.5}>
                    <Col xs={12}>
                        <DashboardCard sPadding="0">
                            <Div sHeight={25}>{claims && <Map claims={claims} />}</Div>
                        </DashboardCard>
                    </Col>
                </Row>
            </Grid>
        </Section>
    );
};
