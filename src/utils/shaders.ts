// Source: https://github.com/drcmda/glsl-curl-noise2
// and: https://github.com/guoweish/glsl-noise-simplex/blob/master/3d.glsl

export const CurlNoise = `

vec2 hash( vec2 p )
{
	p = vec2( dot(p,vec2(127.1,311.7)),
			  dot(p,vec2(269.5,183.3)) );

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    vec2 i = floor( p );
    vec2 f = fract( p );
	
	vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( hash( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ), 
                     dot( hash( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ), 
                     dot( hash( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

vec2 curl(vec2 uvCoord)
{
	float pN = noise( uvCoord + vec2(0,1) );
	float pS = noise( uvCoord - vec2(0,1) );
	float pE = noise( uvCoord + vec2(1,0) );
	float pW = noise( uvCoord - vec2(1,0) );

	return vec2((pN - pS), -(pE - pW));
}
`;
